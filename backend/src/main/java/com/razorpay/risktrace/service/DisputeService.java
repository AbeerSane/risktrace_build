package com.razorpay.risktrace.service;

import com.razorpay.risktrace.dto.*;
import com.razorpay.risktrace.entity.*;
import com.razorpay.risktrace.enums.DisputeStatus;
import com.razorpay.risktrace.exception.ResourceNotFoundException;
import com.razorpay.risktrace.repository.DisputeRepository;
import com.razorpay.risktrace.repository.ShipmentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DisputeService {

    private final DisputeRepository disputeRepository;
    private final ShipmentRepository shipmentRepository;
    private final com.razorpay.risktrace.repository.AuditEventRepository auditEventRepository;

    public DisputeService(DisputeRepository disputeRepository, ShipmentRepository shipmentRepository, com.razorpay.risktrace.repository.AuditEventRepository auditEventRepository) {
        this.disputeRepository = disputeRepository;
        this.shipmentRepository = shipmentRepository;
        this.auditEventRepository = auditEventRepository;
    }

    public Page<DisputeSummaryDTO> getDisputes(DisputeStatus status, String reason, String priorityLevel, String urgencyLevel, Pageable pageable) {
        Specification<Dispute> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (reason != null && !reason.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("reason")), "%" + reason.toLowerCase() + "%"));
            }
            if (priorityLevel != null && !priorityLevel.isEmpty()) {
                predicates.add(cb.equal(cb.upper(root.get("priorityLevel")), priorityLevel.toUpperCase()));
            }
            if (urgencyLevel != null && !urgencyLevel.isEmpty()) {
                predicates.add(cb.equal(cb.upper(root.get("urgencyLevel")), urgencyLevel.toUpperCase()));
            }
            if (predicates.isEmpty()) return null;
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return disputeRepository.findAll(spec, pageable).map(this::mapToSummaryDTO);
    }

    public DisputeDetailsDTO getDisputeDetails(UUID id) {
        Dispute dispute = disputeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dispute not found with id: " + id));

        return mapToDetailsDTO(dispute);
    }

    public List<AuditEventDTO> getAuditEvents(UUID id) {
        return auditEventRepository.findByDisputeIdOrderByTimestampDesc(id)
            .stream()
            .map(a -> new AuditEventDTO(a.getId(), a.getAction(), a.getPerformedBy(), a.getDetails(), a.getTimestamp()))
            .collect(Collectors.toList());
    }

    private DisputeSummaryDTO mapToSummaryDTO(Dispute d) {
        return new DisputeSummaryDTO(
                d.getId(), d.getMerchant() != null ? d.getMerchant().getName() : null,
                d.getAmount(), d.getCurrency(), d.getReason(),
                d.getStatus(), d.getDecision(), d.getPriorityScore(),
                d.getPriorityLevel(), d.getUrgencyLevel(), d.getPotentialRecovery(),
                d.getCompleteness(), d.getStrength(), d.getCreatedAt()
        );
    }

    private DisputeDetailsDTO mapToDetailsDTO(Dispute d) {
        Merchant m = d.getMerchant();
        Payment p = d.getPayment();
        OrderRecord o = p.getOrder();
        Customer c = o.getCustomer();
        Shipment s = shipmentRepository.findByOrderId(o.getId()).orElse(null);

        MerchantDTO merchantDTO = m != null ? new MerchantDTO(m.getId(), m.getName(), m.getEmail()) : null;
        CustomerDTO customerDTO = c != null ? new CustomerDTO(c.getId(), c.getName(), c.getEmail(), c.getPhone()) : null;
        OrderDTO orderDTO = o != null ? new OrderDTO(o.getId(), o.getOrderNumber(), o.getAmount(), o.getCurrency(), o.getStatus(), o.getCreatedAt()) : null;
        PaymentDTO paymentDTO = p != null ? new PaymentDTO(p.getId(), p.getTransactionId(), p.getAmount(), p.getCurrency(), p.getStatus(), p.getPaymentDate()) : null;
        ShipmentDTO shipmentDTO = s != null ? new ShipmentDTO(s.getId(), s.getTrackingNumber(), s.getCarrier(), s.getStatus(), s.getEstimatedDelivery(), s.getActualDelivery()) : null;

        List<EvidenceDTO> evidenceDTOs = d.getEvidences() != null ? d.getEvidences().stream()
                .map(e -> new EvidenceDTO(e.getId(), e.getType(), e.getContent(), e.getSource(), e.getStatus(), e.getVerified(), e.getCreatedAt()))
                .collect(Collectors.toList()) : List.of();

        return new DisputeDetailsDTO(
                d.getId(), d.getReason(), d.getAmount(), d.getCurrency(),
                d.getStatus(), d.getDecision(), d.getPriorityScore(),
                d.getPriorityLevel(), d.getUrgencyLevel(), d.getPotentialRecovery(),
                d.getCompleteness(), d.getStrength(), d.getCreatedAt(),
                merchantDTO, customerDTO, orderDTO, paymentDTO, shipmentDTO, evidenceDTOs
        );
    }
}
