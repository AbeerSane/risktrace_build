package com.razorpay.risktrace.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record AuditEventDTO(
    UUID id,
    String action,
    String performedBy,
    String details,
    LocalDateTime timestamp
) {}
