package com.razorpay.risktrace.service;

import com.razorpay.risktrace.dto.DisputeIntakeDTO;
import com.razorpay.risktrace.entity.*;
import com.razorpay.risktrace.enums.*;
import com.razorpay.risktrace.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class DisputeIntakeService {

    private final MerchantRepository merchantRepository;
    private final CustomerRepository customerRepository;
    private final OrderRecordRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final ShipmentRepository shipmentRepository;
    private final DisputeRepository disputeRepository;
    private final EvidenceRepository evidenceRepository;
    private final CaseAssessmentService caseAssessmentService;

    public DisputeIntakeService(
            MerchantRepository merchantRepository, CustomerRepository customerRepository,
            OrderRecordRepository orderRepository, PaymentRepository paymentRepository,
            ShipmentRepository shipmentRepository, DisputeRepository disputeRepository,
            EvidenceRepository evidenceRepository, CaseAssessmentService caseAssessmentService) {
        this.merchantRepository = merchantRepository;
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.shipmentRepository = shipmentRepository;
        this.disputeRepository = disputeRepository;
        this.evidenceRepository = evidenceRepository;
        this.caseAssessmentService = caseAssessmentService;
    }

    @Transactional
    public Dispute processIntake(DisputeIntakeDTO intake) {
        // For the hackathon, grab the first merchant
        Merchant merchant = merchantRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new IllegalStateException("No merchant found in database."));

        // Create Customer
        Customer customer = new Customer();
        customer.setName(intake.customerName());
        customer.setEmail(intake.customerEmail());
        customer.setPhone(intake.customerPhone());
        customer.setRiskScore(10); // Default safe score for newly ingested
        customer = customerRepository.save(customer);

        // Create Order
        OrderRecord order = new OrderRecord();
        order.setCustomer(customer);
        order.setMerchant(merchant);
        order.setOrderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setAmount(intake.orderAmount());
        order.setCurrency(intake.orderCurrency());
        order.setStatus(parseEnum(OrderStatus.class, intake.orderStatus(), OrderStatus.COMPLETED));
        order = orderRepository.save(order);

        // Create Payment
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        payment.setAmount(intake.orderAmount());
        payment.setCurrency(intake.orderCurrency());
        payment.setStatus(PaymentStatus.CAPTURED);
        payment.setPaymentMethod(intake.paymentMethod());
        payment.setCardNetwork(intake.paymentMethod().contains("Visa") ? "VISA" : "MASTERCARD");
        payment.setIpAddress(intake.ipAddress());
        payment.setCvvMatched(intake.cvvMatched());
        payment.setAuthenticated3ds(intake.is3dsAuthenticated());
        payment = paymentRepository.save(payment);

        // Create Shipment
        Shipment shipment = new Shipment();
        shipment.setOrder(order);
        shipment.setTrackingNumber(intake.shipmentTracking());
        shipment.setCarrier(intake.shipmentCarrier());
        shipment.setStatus(parseEnum(ShipmentStatus.class, intake.shipmentStatus(), ShipmentStatus.DELIVERED));
        shipment.setShippingAddress(intake.shipmentAddress());
        shipment = shipmentRepository.save(shipment);

        // Create Dispute
        Dispute dispute = new Dispute();
        dispute.setMerchant(merchant);
        dispute.setPayment(payment);
        dispute.setAmount(intake.orderAmount());
        dispute.setCurrency(intake.orderCurrency());
        dispute.setReason(intake.disputeReason());
        dispute.setStatus(DisputeStatus.NEW);
        dispute = disputeRepository.save(dispute);

        // Generate Evidence automatically
        generateEvidence(dispute, intake);

        // Run initial case assessment pipeline
        caseAssessmentService.assessCase(dispute.getId());

        return dispute;
    }

    private void generateEvidence(Dispute dispute, DisputeIntakeDTO intake) {
        // Shipment Evidence
        Evidence shippingLog = new Evidence();
        shippingLog.setDispute(dispute);
        shippingLog.setType(EvidenceType.SHIPPING_PROOF);
        shippingLog.setSource(intake.shipmentCarrier() + " API");
        shippingLog.setContent("Tracking: " + intake.shipmentTracking() + " | Address: " + intake.shipmentAddress() + " | Status: " + intake.shipmentStatus());
        shippingLog.setStatus(EvidenceStatus.PROCESSED);
        shippingLog.setVerified(true);
        evidenceRepository.save(shippingLog);

        // Auth Evidence
        Evidence authLog = new Evidence();
        authLog.setDispute(dispute);
        authLog.setType(EvidenceType.AUTHORIZATION_LOG);
        authLog.setSource("Payment Gateway");
        authLog.setContent("IP: " + intake.ipAddress() + " | 3DS: " + intake.is3dsAuthenticated() + " | CVV: " + (intake.cvvMatched() ? "MATCH" : "FAIL"));
        authLog.setStatus(EvidenceStatus.PROCESSED);
        authLog.setVerified(true);
        evidenceRepository.save(authLog);
    }

    private <T extends Enum<T>> T parseEnum(Class<T> enumType, String value, T defaultValue) {
        if (value == null || value.trim().isEmpty()) return defaultValue;
        try {
            return Enum.valueOf(enumType, value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return defaultValue;
        }
    }
}
