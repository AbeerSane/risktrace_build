package com.razorpay.risktrace.controller;

import com.razorpay.risktrace.dto.CaseAssessmentDTO;
import com.razorpay.risktrace.dto.DisputeDetailsDTO;
import com.razorpay.risktrace.dto.DisputeSummaryDTO;
import com.razorpay.risktrace.enums.DisputeStatus;
import com.razorpay.risktrace.service.DisputeService;
import com.razorpay.risktrace.dto.InvestigationResultDTO;
import com.razorpay.risktrace.dto.AIRecommendationDTO;
import com.razorpay.risktrace.service.InvestigationEngineService;
import com.razorpay.risktrace.service.CaseAssessmentService;
import com.razorpay.risktrace.service.AiInvestigationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/disputes")
@CrossOrigin(origins = "*")
public class DisputeController {

    private final DisputeService disputeService;
    private final InvestigationEngineService investigationService;
    private final CaseAssessmentService assessmentService;
    private final AiInvestigationService aiInvestigationService;
    private final com.razorpay.risktrace.service.InvestigationLifecycleService lifecycleService;

    public DisputeController(DisputeService disputeService, 
                             InvestigationEngineService investigationService, 
                             CaseAssessmentService assessmentService,
                             AiInvestigationService aiInvestigationService,
                             com.razorpay.risktrace.service.InvestigationLifecycleService lifecycleService) {
        this.disputeService = disputeService;
        this.investigationService = investigationService;
        this.assessmentService = assessmentService;
        this.aiInvestigationService = aiInvestigationService;
        this.lifecycleService = lifecycleService;
    }

    @GetMapping
    public ResponseEntity<Page<DisputeSummaryDTO>> getDisputes(
            @RequestParam(required = false) DisputeStatus status,
            @RequestParam(required = false) String reason,
            @RequestParam(required = false) String priorityLevel,
            @RequestParam(required = false) String urgencyLevel,
            Pageable pageable) {
        return ResponseEntity.ok(disputeService.getDisputes(status, reason, priorityLevel, urgencyLevel, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisputeDetailsDTO> getDisputeDetails(@PathVariable UUID id) {
        return ResponseEntity.ok(disputeService.getDisputeDetails(id));
    }

    @GetMapping("/{id}/investigate")
    public ResponseEntity<InvestigationResultDTO> investigateDispute(@PathVariable UUID id) {
        return ResponseEntity.ok(investigationService.investigateDispute(id));
    }

    @GetMapping("/{id}/assess")
    public ResponseEntity<CaseAssessmentDTO> assessCase(@PathVariable UUID id) {
        return ResponseEntity.ok(assessmentService.assessCase(id));
    }

    @PostMapping("/{id}/ai-investigate")
    public ResponseEntity<AIRecommendationDTO> aiInvestigateDispute(@PathVariable UUID id) {
        return ResponseEntity.ok(aiInvestigationService.investigate(id));
    }

    @PostMapping("/{id}/investigate-async")
    public ResponseEntity<com.razorpay.risktrace.dto.InvestigationSessionDTO> startAsyncInvestigation(@PathVariable UUID id) {
        com.razorpay.risktrace.dto.InvestigationSessionDTO session = lifecycleService.startInvestigation(id);
        lifecycleService.executeLifecycle(session.id(), id);
        return ResponseEntity.ok(session);
    }

    @PostMapping("/{id}/decision")
    public ResponseEntity<Void> submitDecision(@PathVariable UUID id, @RequestBody com.razorpay.risktrace.dto.DecisionRequestDTO request, @org.springframework.beans.factory.annotation.Autowired com.razorpay.risktrace.service.DecisionWorkflowService decisionWorkflowService) {
        decisionWorkflowService.submitMerchantDecision(id, request);
        return ResponseEntity.ok().build();
    }
}
