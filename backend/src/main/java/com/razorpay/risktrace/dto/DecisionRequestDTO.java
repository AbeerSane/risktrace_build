package com.razorpay.risktrace.dto;

import com.razorpay.risktrace.enums.DisputeDecision;

public record DecisionRequestDTO(
        DisputeDecision decision,
        AIRecommendationDTO aiRecommendation
) {}
