package com.razorpay.risktrace.controller;

import com.razorpay.risktrace.dto.EvidenceDTO;
import com.razorpay.risktrace.service.EvidenceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/disputes/{disputeId}/evidence")
@CrossOrigin(origins = "*")
public class EvidenceController {

    private final EvidenceService evidenceService;

    public EvidenceController(EvidenceService evidenceService) {
        this.evidenceService = evidenceService;
    }

    @PostMapping
    public ResponseEntity<EvidenceDTO> addEvidence(
            @PathVariable UUID disputeId,
            @RequestBody EvidenceDTO request) {
        return ResponseEntity.ok(evidenceService.addEvidence(disputeId, request));
    }
}
