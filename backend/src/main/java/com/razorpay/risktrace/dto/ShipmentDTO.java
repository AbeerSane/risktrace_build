package com.razorpay.risktrace.dto;

import com.razorpay.risktrace.enums.ShipmentStatus;
import java.time.LocalDateTime;
import java.util.UUID;

public record ShipmentDTO(
    UUID id,
    String trackingNumber,
    String carrier,
    ShipmentStatus status,
    LocalDateTime estimatedDelivery,
    LocalDateTime actualDelivery
) {}
