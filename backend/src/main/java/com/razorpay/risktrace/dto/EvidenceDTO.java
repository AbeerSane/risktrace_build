package com.razorpay.risktrace.dto;

import com.razorpay.risktrace.enums.EvidenceStatus;
import com.razorpay.risktrace.enums.EvidenceType;
import java.time.LocalDateTime;
import java.util.UUID;

public record EvidenceDTO(
    UUID id,
    EvidenceType type,
    String content,
    String source,
    EvidenceStatus status,
    Boolean verified,
    LocalDateTime createdAt
) {}
