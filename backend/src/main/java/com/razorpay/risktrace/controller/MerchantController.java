package com.razorpay.risktrace.controller;

import com.razorpay.risktrace.dto.MerchantDTO;
import com.razorpay.risktrace.service.MerchantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/merchants")
@CrossOrigin(origins = "*")
public class MerchantController {

    private final MerchantService merchantService;

    public MerchantController(MerchantService merchantService) {
        this.merchantService = merchantService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<MerchantDTO> getMerchant(@PathVariable UUID id) {
        return ResponseEntity.ok(merchantService.getMerchant(id));
    }
}
