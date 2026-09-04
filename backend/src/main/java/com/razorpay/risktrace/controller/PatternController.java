package com.razorpay.risktrace.controller;

import com.razorpay.risktrace.dto.PatternDTO;
import com.razorpay.risktrace.service.PatternDetectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/patterns")
@CrossOrigin(origins = "${risktrace.cors.allowed-origins:http://localhost:5173}")
public class PatternController {

    private final PatternDetectionService patternDetectionService;

    public PatternController(PatternDetectionService patternDetectionService) {
        this.patternDetectionService = patternDetectionService;
    }

    @GetMapping
    public ResponseEntity<List<PatternDTO>> getPatterns() {
        return ResponseEntity.ok(patternDetectionService.detectPatterns());
    }
}
