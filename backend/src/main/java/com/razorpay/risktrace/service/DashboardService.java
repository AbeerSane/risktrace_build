package com.razorpay.risktrace.service;

import com.razorpay.risktrace.dto.DashboardMetricsDTO;
import com.razorpay.risktrace.enums.DisputeStatus;
import com.razorpay.risktrace.repository.DisputeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class DashboardService {
    
    private final DisputeRepository disputeRepository;
    
    public DashboardService(DisputeRepository disputeRepository) {
        this.disputeRepository = disputeRepository;
    }
    
    public DashboardMetricsDTO getMetrics() {
        long total = disputeRepository.countTotalDisputes();
        long newDisputes = disputeRepository.countByStatus(DisputeStatus.NEW);
        long investigating = disputeRepository.countByStatus(DisputeStatus.INVESTIGATING);
        long won = disputeRepository.countByStatus(DisputeStatus.WON);
        long lost = disputeRepository.countByStatus(DisputeStatus.LOST);
        long actionRequired = disputeRepository.countByStatus(DisputeStatus.REQUIRES_ACTION);
        
        java.math.BigDecimal moneyAtRisk = disputeRepository.sumMoneyAtRisk();
        long activeDisputes = newDisputes + investigating + actionRequired;
        long highPriority = disputeRepository.countHighPriority();
        long urgent = disputeRepository.countUrgent();
        Double avgStrengthObj = disputeRepository.getAverageStrength();
        double avgStrength = avgStrengthObj != null ? avgStrengthObj : 0.0;
        long aiAttention = actionRequired; // Based on plan, we use actionRequired for this right now

        java.util.List<com.razorpay.risktrace.dto.DisputeSummaryDTO> recentDisputes = disputeRepository.findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(d -> new com.razorpay.risktrace.dto.DisputeSummaryDTO(
                        d.getId(), 
                        d.getMerchant().getName(), 
                        d.getAmount(), 
                        d.getCurrency(), 
                        d.getReason(), 
                        d.getStatus(), 
                        d.getDecision(),
                        d.getPriorityScore(), 
                        d.getPriorityLevel(), 
                        d.getUrgencyLevel(), 
                        d.getPotentialRecovery(), 
                        d.getCompleteness(), 
                        d.getStrength(), 
                        d.getCreatedAt()))
                .toList();
        
        return new DashboardMetricsDTO(
            total, newDisputes, investigating, won, lost, actionRequired, 
            disputeRepository.sumTotalDisputedAmount(),
            moneyAtRisk, activeDisputes, highPriority, avgStrength, urgent, aiAttention, recentDisputes
        );
    }
}
