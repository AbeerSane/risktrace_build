package com.razorpay.risktrace.dto;

import java.util.List;

public record AIRecommendationDTO(
    String recommendation,
    int confidence,
    String reasoning,
    List<String> strongestSupportingEvidence,
    List<String> missingEvidence,
    List<String> contradictions,
    List<String> risks,
    String recommendedNextStep
) {}
