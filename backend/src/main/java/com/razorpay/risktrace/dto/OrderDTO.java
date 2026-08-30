package com.razorpay.risktrace.dto;

import com.razorpay.risktrace.enums.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record OrderDTO(
    UUID id,
    String orderNumber,
    BigDecimal amount,
    String currency,
    OrderStatus status,
    LocalDateTime createdAt
) {}
