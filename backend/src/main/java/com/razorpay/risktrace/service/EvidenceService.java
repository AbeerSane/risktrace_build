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

    public EvidenceService(EvidenceRepository evidenceRepository, DisputeRepository disputeRepository) {
        this.evidenceRepository = evidenceRepository;
        this.disputeRepository = disputeRepository;
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

        return new EvidenceDTO(
                evidence.getId(), evidence.getType(), evidence.getContent(),
                evidence.getSource(), evidence.getStatus(), evidence.getVerified(),
                evidence.getCreatedAt()
        );
    }
}
