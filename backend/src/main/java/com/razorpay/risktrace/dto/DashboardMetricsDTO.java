package com.razorpay.risktrace.dto;

import java.math.BigDecimal;
import java.util.List;

public record DashboardMetricsDTO(
    long totalDisputes,
    long newDisputes,
    long investigatingDisputes,
    long wonDisputes,
    long lostDisputes,
    long actionRequiredDisputes,
    BigDecimal totalDisputedAmount,
    
    // New fields for Command Center
    BigDecimal moneyAtRisk,
    long activeDisputes,
    long highPriorityCases,
    double averageCaseStrength,
    long urgentDeadlines,
    long aiInvestigationsRequiringAttention,
    List<DisputeSummaryDTO> recentDisputes
) {}
