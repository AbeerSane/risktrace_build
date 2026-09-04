package com.razorpay.risktrace.controller;

import com.razorpay.risktrace.dto.InvestigationSessionDTO;
import com.razorpay.risktrace.service.InvestigationLifecycleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/investigations")
@CrossOrigin(origins = "${risktrace.cors.allowed-origins:http://localhost:5173}")
public class InvestigationController {

    private final InvestigationLifecycleService lifecycleService;

    public InvestigationController(InvestigationLifecycleService lifecycleService) {
        this.lifecycleService = lifecycleService;
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<InvestigationSessionDTO> getInvestigationSession(@PathVariable UUID sessionId) {
        return ResponseEntity.ok(lifecycleService.getSession(sessionId));
    }
}
