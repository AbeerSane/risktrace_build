package com.razorpay.risktrace.dto;

import com.razorpay.risktrace.enums.DisputeDecision;
import com.razorpay.risktrace.enums.DisputeStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record DisputeSummaryDTO(
    UUID id,
    String merchantName,
    BigDecimal amount,
    String currency,
    String reason,
    DisputeStatus status,
    DisputeDecision decision,
    Integer priorityScore,
    String priorityLevel,
    String urgencyLevel,
    BigDecimal potentialRecovery,
    Integer completeness,
    Integer strength,
    LocalDateTime createdAt
) {}
