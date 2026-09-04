package com.razorpay.risktrace.service;

import com.razorpay.risktrace.dto.EvidenceDTO;
import com.razorpay.risktrace.entity.Dispute;
import com.razorpay.risktrace.entity.Evidence;
import com.razorpay.risktrace.enums.EvidenceStatus;
import com.razorpay.risktrace.exception.ResourceNotFoundException;
import com.razorpay.risktrace.repository.DisputeRepository;
import com.razorpay.risktrace.repository.EvidenceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class EvidenceService {

    private final EvidenceRepository evidenceRepository;
    private final DisputeRepository disputeRepository;
    private final StorageService storageService;
    private final CaseAssessmentService caseAssessmentService;
    private final DocumentExtractionService documentExtractionService;
    private final AuditService auditService;

    public EvidenceService(EvidenceRepository evidenceRepository, DisputeRepository disputeRepository, 
                           StorageService storageService, CaseAssessmentService caseAssessmentService,
                           DocumentExtractionService documentExtractionService, AuditService auditService) {
        this.evidenceRepository = evidenceRepository;
        this.disputeRepository = disputeRepository;
        this.storageService = storageService;
        this.caseAssessmentService = caseAssessmentService;
        this.documentExtractionService = documentExtractionService;
        this.auditService = auditService;
    }

    public EvidenceDTO addEvidence(UUID disputeId, EvidenceDTO request) {
        Dispute dispute = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new ResourceNotFoundException("Dispute not found with id: " + disputeId));

        Evidence evidence = new Evidence();
        evidence.setDispute(dispute);
        evidence.setType(request.type());
        evidence.setContent(request.content());
        evidence.setSource(request.source() != null ? request.source() : "Merchant");
        evidence.setStatus(EvidenceStatus.UNKNOWN);
        evidence.setVerified(false);

        evidence = evidenceRepository.save(evidence);
        
        auditService.logEvent(dispute, "EVIDENCE_ADDED", request.source() != null ? request.source() : "System", "Evidence type " + request.type() + " added to case.");

        return new EvidenceDTO(
                evidence.getId(), evidence.getType(), evidence.getContent(),
                evidence.getSource(), evidence.getStatus(), evidence.getVerified(),
                evidence.getCreatedAt()
        );
    }
    public EvidenceDTO uploadEvidence(UUID disputeId, org.springframework.web.multipart.MultipartFile file) {
        Dispute dispute = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new ResourceNotFoundException("Dispute not found with id: " + disputeId));

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("File size exceeds 5MB limit");
        }

        String contentType = file.getContentType();
        if (contentType == null || (!contentType.startsWith("image/") && !contentType.equals("application/pdf"))) {
            throw new IllegalArgumentException("Only images and PDFs are allowed");
        }

        String urlPath = storageService.store(file);
        
        // Mock AI Extraction
        DocumentExtractionService.ExtractionResult result = documentExtractionService.extract(file, urlPath);

        Evidence evidence = new Evidence();
        evidence.setDispute(dispute);
        evidence.setType(com.razorpay.risktrace.enums.EvidenceType.MERCHANT_UPLOADED);
        
        if (result.success()) {
            evidence.setStatus(EvidenceStatus.PENDING_REVIEW); // Staged for human review
            
            // Format content to include JSON of extracted facts so frontend can parse it
            String jsonContent = "{\"url\": \"" + urlPath + "\", \"facts\": [\"" + String.join("\", \"", result.extractedFacts()) + "\"]}";
            evidence.setContent(jsonContent);
            evidence.setVerified(false);
        } else {
            evidence.setStatus(EvidenceStatus.FAILED);
            evidence.setContent("{\"url\": \"" + urlPath + "\", \"error\": \"Extraction failed. AI could not parse document.\"}");
            evidence.setVerified(false);
        }
        
        evidence.setSource("AI Document Extraction");
        evidence = evidenceRepository.save(evidence);

        auditService.logEvent(dispute, "EVIDENCE_UPLOADED", "Merchant", "New file uploaded for AI processing: " + file.getOriginalFilename());

        return new EvidenceDTO(
                evidence.getId(), evidence.getType(), evidence.getContent(),
                evidence.getSource(), evidence.getStatus(), evidence.getVerified(),
                evidence.getCreatedAt()
        );
    }

    public EvidenceDTO acceptEvidence(UUID disputeId, UUID evidenceId) {
        Evidence evidence = evidenceRepository.findById(evidenceId)
                .orElseThrow(() -> new ResourceNotFoundException("Evidence not found with id: " + evidenceId));

        if (!evidence.getDispute().getId().equals(disputeId)) {
            throw new IllegalArgumentException("Evidence does not belong to this dispute.");
        }

        evidence.setVerified(true);
        evidence.setStatus(EvidenceStatus.PROCESSED);
        evidence = evidenceRepository.save(evidence);

        // Now that it's verified, we trigger reassessment so the graph includes it!
        caseAssessmentService.assessCase(disputeId);
        
        auditService.logEvent(evidence.getDispute(), "EVIDENCE_REASSESSMENT", "System", "New evidence successfully extracted and accepted. Case reassessed.");

        return new EvidenceDTO(
                evidence.getId(), evidence.getType(), evidence.getContent(),
                evidence.getSource(), evidence.getStatus(), evidence.getVerified(),
                evidence.getCreatedAt()
        );
    }
}
