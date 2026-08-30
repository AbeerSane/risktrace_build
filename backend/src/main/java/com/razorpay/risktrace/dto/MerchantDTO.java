package com.razorpay.risktrace.dto;

import java.util.UUID;

public record MerchantDTO(
    UUID id,
    String name,
    String email
) {}
