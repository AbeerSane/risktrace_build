package com.razorpay.risktrace.dto;

import java.util.UUID;

public record CustomerDTO(
    UUID id,
    String name,
    String email,
    String phone
) {}
