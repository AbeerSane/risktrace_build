package com.razorpay.risktrace.service;

import com.razorpay.risktrace.dto.CaseAssessmentDTO;
import com.razorpay.risktrace.dto.InvestigationResultDTO;
import com.razorpay.risktrace.entity.Dispute;
import com.razorpay.risktrace.exception.ResourceNotFoundException;
import com.razorpay.risktrace.repository.DisputeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class CaseAssessmentService {

    private final DisputeRepository disputeRepository;
    private final InvestigationEngineService investigationEngineService;

    public CaseAssessmentService(DisputeRepository disputeRepository, InvestigationEngineService investigationEngineService) {
        this.disputeRepository = disputeRepository;
        this.investigationEngineService = investigationEngineService;
    }

    @Transactional
    public CaseAssessmentDTO assessCase(UUID disputeId) {
        Dispute dispute = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new ResourceNotFoundException("Dispute not found with id: " + disputeId));

        // 1. Run Investigation Engine to get base metrics
        InvestigationResultDTO investigation = investigationEngineService.investigateDispute(disputeId);
        
        // 2. Calculate Urgency
        LocalDateTime deadline = dispute.getCreatedAt().plusDays(30); // Standard chargeback window
        long daysRemaining = ChronoUnit.DAYS.between(LocalDateTime.now(), deadline);
        
        String urgency;
        int urgencyScore;
        if (daysRemaining <= 3) {
            urgency = "CRITICAL";
            urgencyScore = 100;
        } else if (daysRemaining <= 7) {
            urgency = "HIGH";
            urgencyScore = 80;
        } else if (daysRemaining <= 15) {
            urgency = "MEDIUM";
            urgencyScore = 50;
        } else {
            urgency = "LOW";
            urgencyScore = 20;
        }

        // 3. Calculate Investigation Effort
        int issuesCount = investigation.missingEvidence().size() + investigation.contradictoryEvidence().size();
        String effort;
        int effortScore; // Higher score means LESS effort (better for priority)
        if (issuesCount == 0) {
            effort = "LOW";
            effortScore = 100;
        } else if (issuesCount <= 2) {
            effort = "MEDIUM";
            effortScore = 60;
        } else {
            effort = "HIGH";
            effortScore = 20;
        }

        // 4. Calculate Potential Recovery
        BigDecimal strengthMultiplier = BigDecimal.valueOf(investigation.evidenceStrength()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal potentialRecovery = dispute.getAmount().multiply(strengthMultiplier).setScale(2, RoundingMode.HALF_UP);
        
        // Normalize recovery for priority calculation (assume max expected dispute is ~10,000 for scoring)
        int recoveryScore = Math.min(100, (int) (potentialRecovery.doubleValue() / 10000.0 * 100));

        // 5. Calculate Priority Score (0-100)
        // Weight: 40% Recovery, 40% Urgency, 20% Effort ease
        int priorityScore = (int) ((recoveryScore * 0.4) + (urgencyScore * 0.4) + (effortScore * 0.2));
        priorityScore = Math.max(0, Math.min(100, priorityScore));

        // 6. Build Explanation
        StringBuilder explanation = new StringBuilder();
        explanation.append("Priority is ").append(priorityScore).append("/100 based on: ");
        explanation.append("Potential recovery of ").append(dispute.getCurrency()).append(" ").append(potentialRecovery).append(". ");
        explanation.append("Urgency is ").append(urgency).append(" (").append(daysRemaining).append(" days remaining). ");
        explanation.append("Investigation effort is ").append(effort).append(" due to ").append(issuesCount).append(" missing/contradictory items. ");

        // Update Entity
        dispute.setUrgencyLevel(urgency);
        dispute.setPriorityScore(priorityScore);
        dispute.setPriorityLevel(priorityScore > 80 ? "HIGH" : priorityScore > 50 ? "MEDIUM" : "LOW");
        dispute.setPotentialRecovery(potentialRecovery);
        disputeRepository.save(dispute);

        return new CaseAssessmentDTO(
                disputeId,
                investigation.evidenceStrength(),
                investigation.evidenceCompleteness(),
                urgency,
                potentialRecovery,
                effort,
                priorityScore,
                explanation.toString().trim()
        );
    }
}
