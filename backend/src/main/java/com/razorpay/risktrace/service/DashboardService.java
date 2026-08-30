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
        
        return new DashboardMetricsDTO(
            total, newDisputes, investigating, won, lost, actionRequired, 
            disputeRepository.sumTotalDisputedAmount()
        );
    }
}
