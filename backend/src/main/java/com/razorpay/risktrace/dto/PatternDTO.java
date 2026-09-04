package com.razorpay.risktrace.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record PatternDTO(
    String id,
    String title,
    List<UUID> affectedDisputeIds,
    BigDecimal moneyExposed,
    Map<String, String> commonAttributes,
    String likelyCause,
    String recommendedAction,
    int confidenceScore,
    LocalDateTime createdAt,
    AiExplanation aiExplanation
) {
    public record AiExplanation(
        String connectionReason,
        String likelyProblem,
        List<String> supportingEvidence,
        String uncertainty,
        String recommendedInvestigation
    ) {}
}
