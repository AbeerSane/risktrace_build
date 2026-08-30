package com.razorpay.risktrace.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record CaseAssessmentDTO(
    UUID disputeId,
    Integer caseStrength,
    Integer evidenceCompleteness,
    String urgency,
    BigDecimal potentialRecovery,
    String investigationEffort,
    Integer priorityScore,
    String explanation
) {}
