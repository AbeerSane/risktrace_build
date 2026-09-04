package com.razorpay.risktrace.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.razorpay.risktrace.dto.InvestigationSessionDTO;
import com.razorpay.risktrace.dto.VerifiedCasePackageDTO;
import com.razorpay.risktrace.entity.Dispute;
import com.razorpay.risktrace.entity.InvestigationSession;
import com.razorpay.risktrace.enums.InvestigationStatus;
import com.razorpay.risktrace.repository.DisputeRepository;
import com.razorpay.risktrace.repository.InvestigationSessionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class InvestigationLifecycleService {

    private static final Logger logger = LoggerFactory.getLogger(InvestigationLifecycleService.class);

    private final InvestigationSessionRepository sessionRepository;
    private final DisputeRepository disputeRepository;
    private final DisputeService disputeService;
    private final InvestigationEngineService investigationEngineService;
    private final CaseAssessmentService caseAssessmentService;
    private final AiInvestigationService aiInvestigationService;
    private final ObjectMapper objectMapper;
    private final AuditService auditService;

    public InvestigationLifecycleService(
            InvestigationSessionRepository sessionRepository,
            DisputeRepository disputeRepository,
            DisputeService disputeService,
            InvestigationEngineService investigationEngineService,
            CaseAssessmentService caseAssessmentService,
            AiInvestigationService aiInvestigationService,
            ObjectMapper objectMapper,
            AuditService auditService) {
        this.sessionRepository = sessionRepository;
        this.disputeRepository = disputeRepository;
        this.disputeService = disputeService;
        this.investigationEngineService = investigationEngineService;
        this.caseAssessmentService = caseAssessmentService;
        this.aiInvestigationService = aiInvestigationService;
        this.objectMapper = objectMapper;
        this.auditService = auditService;
    }

    @Transactional
    public InvestigationSessionDTO startInvestigation(UUID disputeId) {
        Dispute dispute = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new IllegalArgumentException("Dispute not found"));

        InvestigationSession session = new InvestigationSession();
        session.setDispute(dispute);
        session.setStatus(InvestigationStatus.INITIALIZING);
        session = sessionRepository.save(session);
        
        auditService.logEvent(dispute, "INVESTIGATION_STARTED", "System", "Automated investigation initiated.");

        return mapToDTO(session);
    }

    @Async
    public void executeLifecycle(UUID sessionId, UUID disputeId) {
        try {
            logger.info("Starting async lifecycle for session {}", sessionId);

            // Phase 1: RECONSTRUCTING_TRANSACTION
            updateStatus(sessionId, InvestigationStatus.RECONSTRUCTING_TRANSACTION);
            var disputeDetails = disputeService.getDisputeDetails(disputeId);

            // Phase 2: GATHERING_EVIDENCE & ANALYZING_EVIDENCE & DETECTING_CONTRADICTIONS
            // (These are currently handled synchronously by investigateDispute, but we can simulate the state updates)
            updateStatus(sessionId, InvestigationStatus.GATHERING_EVIDENCE);
            updateStatus(sessionId, InvestigationStatus.ANALYZING_EVIDENCE);
            updateStatus(sessionId, InvestigationStatus.DETECTING_CONTRADICTIONS);
            var investigationResult = investigationEngineService.investigateDispute(disputeId);

            // Phase 3: ASSESSING_CASE
            updateStatus(sessionId, InvestigationStatus.ASSESSING_CASE);
            var assessment = caseAssessmentService.assessCase(disputeId);

            // Phase 4: AI_REASONING
            updateStatus(sessionId, InvestigationStatus.AI_REASONING);
            var casePackage = new VerifiedCasePackageDTO(disputeDetails, investigationResult, assessment);
            
            Object aiRecommendation = null;
            try {
                aiRecommendation = aiInvestigationService.investigate(disputeId);
            } catch (Exception e) {
                logger.warn("AI Investigation failed. Continuing without AI recommendation.", e);
            }

            // Phase 5: COMPLETE
            completeInvestigation(sessionId, casePackage, aiRecommendation);

        } catch (Exception e) {
            logger.error("Investigation failed for session " + sessionId, e);
            failInvestigation(sessionId, e.getMessage());
        }
    }

    // Requires NEW transaction so status updates are immediately visible to clients polling the API
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void updateStatus(UUID sessionId, InvestigationStatus status) {
        InvestigationSession session = sessionRepository.findById(sessionId).orElseThrow();
        session.setStatus(status);
        sessionRepository.save(session);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void completeInvestigation(UUID sessionId, VerifiedCasePackageDTO casePackage, Object aiRecommendation) {
        InvestigationSession session = sessionRepository.findById(sessionId).orElseThrow();
        session.setStatus(InvestigationStatus.COMPLETE);
        try {
            String payload = objectMapper.writeValueAsString(
                    java.util.Map.of("casePackage", casePackage, "aiRecommendation", aiRecommendation != null ? aiRecommendation : java.util.Map.of("status", "FAILED", "reason", "AI Unavailable"))
            );
            session.setResultPayload(payload);
        } catch (Exception e) {
            session.setErrorReason("Failed to serialize result payload");
        }
        sessionRepository.save(session);
        auditService.logEvent(session.getDispute(), "INVESTIGATION_COMPLETED", "System", "Automated investigation phases complete. Awaiting merchant decision.");
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void failInvestigation(UUID sessionId, String reason) {
        sessionRepository.findById(sessionId).ifPresent(session -> {
            session.setStatus(InvestigationStatus.FAILED);
            session.setErrorReason(reason);
            sessionRepository.save(session);
        });
    }

    public InvestigationSessionDTO getSession(UUID sessionId) {
        InvestigationSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));
        return mapToDTO(session);
    }

    private InvestigationSessionDTO mapToDTO(InvestigationSession session) {
        return new InvestigationSessionDTO(
                session.getId(),
                session.getDispute().getId(),
                session.getStatus(),
                session.getErrorReason(),
                session.getStartedAt(),
                session.getUpdatedAt(),
                session.getResultPayload()
        );
    }
}
