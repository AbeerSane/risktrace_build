package com.razorpay.risktrace.service;

import com.razorpay.risktrace.dto.EvidenceDTO;
import com.razorpay.risktrace.dto.InvestigationResultDTO;
import com.razorpay.risktrace.entity.Dispute;
import com.razorpay.risktrace.entity.Evidence;
import com.razorpay.risktrace.entity.Shipment;
import com.razorpay.risktrace.enums.EvidenceStatus;
import com.razorpay.risktrace.enums.EvidenceType;
import com.razorpay.risktrace.enums.ShipmentStatus;
import com.razorpay.risktrace.exception.ResourceNotFoundException;
import com.razorpay.risktrace.repository.DisputeRepository;
import com.razorpay.risktrace.repository.ShipmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class InvestigationEngineService {

    private final DisputeRepository disputeRepository;
    private final ShipmentRepository shipmentRepository;

    public InvestigationEngineService(DisputeRepository disputeRepository, ShipmentRepository shipmentRepository) {
        this.disputeRepository = disputeRepository;
        this.shipmentRepository = shipmentRepository;
    }

    @Transactional
    public InvestigationResultDTO investigateDispute(UUID disputeId) {
        Dispute dispute = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new ResourceNotFoundException("Dispute not found with id: " + disputeId));

        List<Evidence> allEvidence = dispute.getEvidences() != null ? dispute.getEvidences() : new ArrayList<>();

        // 1. Determine Required Evidence based on Reason
        Set<EvidenceType> requiredTypes = getRequiredEvidenceTypes(dispute.getReason());

        // 2. Categorize provided evidence
        List<EvidenceDTO> supporting = new ArrayList<>();
        List<EvidenceDTO> contradictory = new ArrayList<>();
        Set<EvidenceType> providedTypes = new HashSet<>();

        for (Evidence e : allEvidence) {
            providedTypes.add(e.getType());
            EvidenceDTO dto = new EvidenceDTO(
                    e.getId(), e.getType(), e.getContent(), e.getSource(),
                    e.getStatus(), e.getVerified(), e.getCreatedAt()
            );
            if (e.getStatus() == EvidenceStatus.SUPPORTING) {
                supporting.add(dto);
            } else if (e.getStatus() == EvidenceStatus.CONTRADICTORY) {
                contradictory.add(dto);
            }
            // MISSING and UNKNOWN are ignored in these lists
        }

        // 3. Find Missing Evidence
        List<EvidenceType> missing = new ArrayList<>();
        for (EvidenceType required : requiredTypes) {
            if (!providedTypes.contains(required)) {
                missing.add(required);
            }
        }

        // 4. Calculate Completeness (0-100)
        int completeness = 100;
        if (!requiredTypes.isEmpty()) {
            int providedRequiredCount = requiredTypes.size() - missing.size();
            completeness = (int) Math.round(((double) providedRequiredCount / requiredTypes.size()) * 100);
        }

        // 5. Calculate Base Strength based on Evidence
        int strength = completeness / 2; // base score up to 50
        strength += supporting.size() * 20;
        strength -= contradictory.size() * 40;

        // 6. Cross-reference contextual Postgres relationships
        StringBuilder summaryBuilder = new StringBuilder();
        
        Optional<Shipment> shipmentOpt = shipmentRepository.findByOrderId(dispute.getPayment().getOrder().getId());
        
        if ("Product not delivered".equalsIgnoreCase(dispute.getReason())) {
            if (shipmentOpt.isPresent() && shipmentOpt.get().getStatus() == ShipmentStatus.DELIVERED) {
                strength += 40;
                summaryBuilder.append("System records verify the shipment was successfully DELIVERED, significantly strengthening the merchant's case. ");
            } else {
                strength -= 20;
                summaryBuilder.append("No record of successful delivery found in the system. ");
            }
        } else if ("Fraudulent transaction".equalsIgnoreCase(dispute.getReason())) {
            // Simulated check: If there is supporting log data matching IP
            if (supporting.stream().anyMatch(e -> e.type() == EvidenceType.LOG_DATA)) {
                strength += 30;
                summaryBuilder.append("Log data strongly corroborates the customer's identity, invalidating the fraud claim. ");
            }
        }

        // Clamp strength between 0 and 100
        strength = Math.max(0, Math.min(100, strength));

        if (summaryBuilder.isEmpty()) {
            if (strength >= 80) summaryBuilder.append("The merchant has a very strong case based on provided evidence.");
            else if (strength >= 50) summaryBuilder.append("The case has moderate evidence. More required evidence could help.");
            else summaryBuilder.append("The merchant's case is weak due to missing or contradictory evidence.");
        }

        // 7. Update Dispute entity
        dispute.setCompleteness(completeness);
        dispute.setStrength(strength);
        disputeRepository.save(dispute);

        return new InvestigationResultDTO(
                dispute.getId(),
                supporting,
                missing,
                contradictory,
                completeness,
                strength,
                summaryBuilder.toString().trim()
        );
    }

    private Set<EvidenceType> getRequiredEvidenceTypes(String reason) {
        if (reason == null) return Set.of(EvidenceType.RECEIPT);

        return switch (reason.toLowerCase()) {
            case "product not delivered" -> Set.of(EvidenceType.TRACKING_NUMBER, EvidenceType.CUSTOMER_COMMUNICATION);
            case "fraudulent transaction" -> Set.of(EvidenceType.LOG_DATA, EvidenceType.RECEIPT);
            case "item defective" -> Set.of(EvidenceType.CUSTOMER_COMMUNICATION, EvidenceType.OTHER);
            case "service not provided" -> Set.of(EvidenceType.RECEIPT, EvidenceType.CUSTOMER_COMMUNICATION);
            case "unrecognized charge" -> Set.of(EvidenceType.LOG_DATA, EvidenceType.RECEIPT);
            default -> Set.of(EvidenceType.RECEIPT);
        };
    }
}
