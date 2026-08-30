package com.razorpay.risktrace.dto;

import com.razorpay.risktrace.enums.DisputeDecision;
import com.razorpay.risktrace.enums.DisputeStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record DisputeDetailsDTO(
    UUID id,
    String reason,
    BigDecimal amount,
    String currency,
    DisputeStatus status,
    DisputeDecision decision,
    Integer priorityScore,
    String priorityLevel,
    String urgencyLevel,
    BigDecimal potentialRecovery,
    Integer completeness,
    Integer strength,
    LocalDateTime createdAt,
    MerchantDTO merchant,
    CustomerDTO customer,
    OrderDTO order,
    PaymentDTO payment,
    ShipmentDTO shipment,
    List<EvidenceDTO> evidences
) {}
