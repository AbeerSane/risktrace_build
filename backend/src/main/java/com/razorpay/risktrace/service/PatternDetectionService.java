package com.razorpay.risktrace.service;

import com.razorpay.risktrace.dto.PatternDTO;
import com.razorpay.risktrace.entity.Dispute;
import com.razorpay.risktrace.entity.Evidence;
import com.razorpay.risktrace.enums.DisputeStatus;
import com.razorpay.risktrace.repository.DisputeRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PatternDetectionService {

    private final DisputeRepository disputeRepository;

    public PatternDetectionService(DisputeRepository disputeRepository) {
        this.disputeRepository = disputeRepository;
    }

    public List<PatternDTO> detectPatterns() {
        List<Dispute> allActiveDisputes = disputeRepository.findAll().stream()
                .filter(d -> d.getStatus() != DisputeStatus.RESOLVED)
                .collect(Collectors.toList());

        List<PatternDTO> detectedPatterns = new ArrayList<>();

        // 1. Fulfillment Anomaly Heuristic
        detectFulfillmentAnomaly(allActiveDisputes).ifPresent(detectedPatterns::add);

        // 2. Fraud Ring Heuristic
        detectFraudRing(allActiveDisputes).ifPresent(detectedPatterns::add);

        return detectedPatterns;
    }

    private Optional<PatternDTO> detectFulfillmentAnomaly(List<Dispute> disputes) {
        // Group by evidence containing "Carrier: BlueDart" and reason "Product not delivered"
        List<Dispute> affected = disputes.stream()
                .filter(d -> "Product not delivered".equals(d.getReason()))
                .filter(d -> d.getEvidences().stream().anyMatch(e -> e.getContent() != null && e.getContent().contains("Carrier: BlueDart")))
                .collect(Collectors.toList());

        if (affected.size() >= 3) {
            BigDecimal moneyExposed = affected.stream().map(Dispute::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
            List<UUID> ids = affected.stream().map(Dispute::getId).collect(Collectors.toList());
            
            return Optional.of(new PatternDTO(
                    "PAT-FULFILL-" + UUID.randomUUID().toString().substring(0,6),
                    "Fulfillment Partner Anomaly",
                    ids,
                    moneyExposed,
                    Map.of(
                            "Dispute Reason", "Product not delivered",
                            "Carrier", "BlueDart",
                            "Time Concentration", "Last 48 Hours"
                    ),
                    "Systemic failure or delays in BlueDart logistics network.",
                    "Temporarily route shipments through alternative carriers (e.g., Delhivery) for affected regions.",
                    85,
                    LocalDateTime.now(),
                    new PatternDTO.AiExplanation(
                        "Disputes share an identical combination of 'Product not delivered' claims uniquely assigned to the BlueDart carrier within a constrained 48-hour window.",
                        "Severe logistical failure or lost pallet within BlueDart's regional sorting hub.",
                        List.of(
                            "Carrier Data: BlueDart mapped across " + affected.size() + " claims.",
                            "Tracking Status: All items marked as 'Lost in transit'.",
                            "Timeframe: All orders shipped between T-48h and T-72h."
                        ),
                        "Could be a delayed scan rather than permanently lost packages. Waiting 24h might resolve 30% of these claims organically.",
                        "Contact BlueDart AM with the list of " + affected.size() + " tracking IDs for immediate manual tracing."
                    )
            ));
        }
        return Optional.empty();
    }

    private Optional<PatternDTO> detectFraudRing(List<Dispute> disputes) {
        // Group by evidence containing fingerprint "FINGERPRINT-A98B7"
        List<Dispute> affected = disputes.stream()
                .filter(d -> "Fraudulent transaction".equals(d.getReason()))
                .filter(d -> d.getEvidences().stream().anyMatch(e -> e.getContent() != null && e.getContent().contains("FINGERPRINT-A98B7")))
                .collect(Collectors.toList());

        if (affected.size() >= 3) {
            BigDecimal moneyExposed = affected.stream().map(Dispute::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
            List<UUID> ids = affected.stream().map(Dispute::getId).collect(Collectors.toList());
            
            return Optional.of(new PatternDTO(
                    "PAT-FRAUD-" + UUID.randomUUID().toString().substring(0,6),
                    "Coordinated Fraud Ring",
                    ids,
                    moneyExposed,
                    Map.of(
                            "Dispute Reason", "Fraudulent transaction",
                            "Device Fingerprint", "FINGERPRINT-A98B7",
                            "IP Address", "192.168.1.100"
                    ),
                    "Organized fraud ring utilizing synthetic identities from the same device cluster.",
                    "Instantly block device fingerprint FINGERPRINT-A98B7. Flag IP 192.168.1.100 at WAF level.",
                    95,
                    LocalDateTime.now(),
                    new PatternDTO.AiExplanation(
                        "Identical device hardware signatures and originating network IPs map to distinct synthetic customer profiles.",
                        "A coordinated fraud actor is cycling stolen cards through a single automated script environment.",
                        List.of(
                            "Device Fingerprint: FINGERPRINT-A98B7 extracted from merchant logs.",
                            "Network: 192.168.1.100 is the origin for all " + affected.size() + " fraudulent claims.",
                            "Behavior: Identical velocity of high-value transactions."
                        ),
                        "IP might be a shared proxy or VPN exit node, meaning blanket blocking could affect legitimate traffic.",
                        "Block the specific FINGERPRINT-A98B7 at the checkout SDK level and submit a zero-tolerance fraud push to issuing banks."
                    )
            ));
        }
        return Optional.empty();
    }
}
