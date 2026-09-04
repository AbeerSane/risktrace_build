package com.razorpay.risktrace.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.razorpay.risktrace.dto.DecisionRequestDTO;
import com.razorpay.risktrace.dto.CaseAssessmentDTO;
import com.razorpay.risktrace.entity.AuditEvent;
import com.razorpay.risktrace.entity.Dispute;
import com.razorpay.risktrace.enums.DisputeDecision;
import com.razorpay.risktrace.enums.DisputeStatus;
import com.razorpay.risktrace.repository.AuditEventRepository;
import com.razorpay.risktrace.repository.DisputeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.UUID;

@Service
public class DecisionWorkflowService {

    private final DisputeRepository disputeRepository;
    private final AuditEventRepository auditEventRepository;
    private final CaseAssessmentService caseAssessmentService;
    private final ObjectMapper objectMapper;
    private final AuditService auditService;

    public DecisionWorkflowService(DisputeRepository disputeRepository,
                                   AuditEventRepository auditEventRepository,
                                   CaseAssessmentService caseAssessmentService,
                                   ObjectMapper objectMapper,
                                   AuditService auditService) {
        this.disputeRepository = disputeRepository;
        this.auditEventRepository = auditEventRepository;
        this.caseAssessmentService = caseAssessmentService;
        this.objectMapper = objectMapper;
        this.auditService = auditService;
    }

    @Transactional
    public void submitMerchantDecision(UUID disputeId, DecisionRequestDTO request) {
        Dispute dispute = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new IllegalArgumentException("Dispute not found"));

        if (dispute.getStatus() == DisputeStatus.WON || dispute.getStatus() == DisputeStatus.LOST) {
            throw new IllegalStateException("Cannot make a decision on a closed dispute");
        }

        // 1. Update the decision
        dispute.setDecision(request.decision());

        // 2. Map the decision to the final dispute status simulating hackathon submission
        switch (request.decision()) {
            case CONCEDE -> dispute.setStatus(DisputeStatus.LOST);
            case CONTEST -> dispute.setStatus(DisputeStatus.INVESTIGATING); // or simulated WON if we want immediate closure, let's go with INVESTIGATING for now
            case REQUEST_MORE_EVIDENCE -> dispute.setStatus(DisputeStatus.REQUIRES_ACTION);
            case PENDING -> {} // Should not explicitly submit PENDING, but safely ignore
        }

        disputeRepository.save(dispute);

        // 3. Gather case assessment
        CaseAssessmentDTO assessment = caseAssessmentService.assessCase(disputeId);

        // 4. Record Audit Event
        try {
            String detailsJson = objectMapper.writeValueAsString(Map.of(
                    "merchantDecision", request.decision().name(),
                    "aiRecommendation", request.aiRecommendation() != null ? request.aiRecommendation() : "No AI Recommendation Provided",
                    "caseAssessment", assessment
            ));
            auditService.logEvent(dispute, "MERCHANT_DECISION", "Merchant", detailsJson);
        } catch (Exception e) {
            auditService.logEvent(dispute, "MERCHANT_DECISION", "Merchant", "Decision: " + request.decision().name());
        }
    }
}
