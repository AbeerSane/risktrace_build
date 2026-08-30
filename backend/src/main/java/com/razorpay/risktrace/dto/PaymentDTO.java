package com.razorpay.risktrace.dto;

import com.razorpay.risktrace.enums.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record PaymentDTO(
    UUID id,
    String transactionId,
    BigDecimal amount,
    String currency,
    PaymentStatus status,
    LocalDateTime paymentDate
) {}
