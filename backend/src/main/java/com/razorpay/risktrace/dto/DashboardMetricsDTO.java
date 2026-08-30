package com.razorpay.risktrace.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record DashboardMetricsDTO(
    long totalDisputes,
    long newDisputes,
    long investigatingDisputes,
    long wonDisputes,
    long lostDisputes,
    long actionRequiredDisputes,
    BigDecimal totalDisputedAmount
) {}
