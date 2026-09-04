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
    @PostMapping("/upload")
    public ResponseEntity<EvidenceDTO> uploadEvidence(
            @PathVariable UUID disputeId,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        return ResponseEntity.ok(evidenceService.uploadEvidence(disputeId, file));
    }

    @PostMapping("/{evidenceId}/accept")
    public ResponseEntity<EvidenceDTO> acceptEvidence(
            @PathVariable UUID disputeId,
            @PathVariable UUID evidenceId) {
        return ResponseEntity.ok(evidenceService.acceptEvidence(disputeId, evidenceId));
    }
}
