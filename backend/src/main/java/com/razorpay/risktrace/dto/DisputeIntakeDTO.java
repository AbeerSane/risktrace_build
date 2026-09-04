package com.razorpay.risktrace.dto;

import java.math.BigDecimal;

public record DisputeIntakeDTO(
    String customerName,
    String customerEmail,
    String customerPhone,

    BigDecimal orderAmount,
    String orderCurrency,
    String orderStatus,

    String paymentMethod,
    String ipAddress,
    boolean is3dsAuthenticated,
    boolean cvvMatched,

    String shipmentTracking,
    String shipmentCarrier,
    String shipmentStatus,
    String shipmentAddress,

    String disputeReason
) {}
