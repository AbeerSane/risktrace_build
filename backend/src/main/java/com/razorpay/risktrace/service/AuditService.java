package com.razorpay.risktrace.service;

import com.razorpay.risktrace.entity.AuditEvent;
import com.razorpay.risktrace.entity.Dispute;
import com.razorpay.risktrace.repository.AuditEventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
public class AuditService {
    private final AuditEventRepository auditEventRepository;

    public AuditService(AuditEventRepository auditEventRepository) {
        this.auditEventRepository = auditEventRepository;
    }

    @Transactional
    public void logEvent(Dispute dispute, String action, String performedBy, String details) {
        if (dispute == null) return;
        AuditEvent event = new AuditEvent();
        event.setDispute(dispute);
        event.setAction(action);
        event.setPerformedBy(performedBy);
        event.setDetails(details);
        auditEventRepository.save(event);
    }
}
