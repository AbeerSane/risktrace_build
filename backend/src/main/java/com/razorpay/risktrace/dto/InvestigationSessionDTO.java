package com.razorpay.risktrace.dto;

import com.razorpay.risktrace.enums.InvestigationStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record InvestigationSessionDTO(
        UUID id,
        UUID disputeId,
        InvestigationStatus status,
        String errorReason,
        LocalDateTime startedAt,
        LocalDateTime updatedAt,
        String resultPayload
) {}
