package com.razorpay.risktrace.dto;

import java.math.BigDecimal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Email;

public record DisputeIntakeDTO(
    @NotBlank(message = "Customer name is required")
    String customerName,
    @Email(message = "Invalid email format")
    @NotBlank(message = "Customer email is required")
    String customerEmail,
    String customerPhone,

    @NotNull(message = "Order amount is required")
    @Positive(message = "Amount must be positive")
    BigDecimal orderAmount,
    @NotBlank(message = "Currency is required")
    String orderCurrency,
    @NotBlank(message = "Order status is required")
    String orderStatus,

    @NotBlank(message = "Payment method is required")
    String paymentMethod,
    String ipAddress,
    boolean is3dsAuthenticated,
    boolean cvvMatched,

    String shipmentTracking,
    String shipmentCarrier,
    String shipmentStatus,
    String shipmentAddress,

    @NotBlank(message = "Dispute reason is required")
    String disputeReason
) {}
