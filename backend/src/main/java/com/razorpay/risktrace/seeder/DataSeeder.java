package com.razorpay.risktrace.seeder;

import com.razorpay.risktrace.entity.*;
import com.razorpay.risktrace.enums.*;
import com.razorpay.risktrace.repository.*;
import com.razorpay.risktrace.service.CaseAssessmentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    private final MerchantRepository merchantRepository;
    private final CustomerRepository customerRepository;
    private final OrderRecordRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final ShipmentRepository shipmentRepository;
    private final DisputeRepository disputeRepository;
    private final EvidenceRepository evidenceRepository;
    private final AuditEventRepository auditEventRepository;
    private final InvestigationSessionRepository investigationSessionRepository;
    private final CaseAssessmentService caseAssessmentService;

    @Value("${risktrace.seed.enabled:false}")
    private boolean seedEnabled;

    private final Random random = new Random(42); // Deterministic randomness

    public DataSeeder(MerchantRepository merchantRepository, CustomerRepository customerRepository,
                      OrderRecordRepository orderRepository, PaymentRepository paymentRepository,
                      ShipmentRepository shipmentRepository, DisputeRepository disputeRepository,
                      EvidenceRepository evidenceRepository, AuditEventRepository auditEventRepository,
                      InvestigationSessionRepository investigationSessionRepository,
                      CaseAssessmentService caseAssessmentService) {
        this.merchantRepository = merchantRepository;
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.shipmentRepository = shipmentRepository;
        this.disputeRepository = disputeRepository;
        this.evidenceRepository = evidenceRepository;
        this.auditEventRepository = auditEventRepository;
        this.investigationSessionRepository = investigationSessionRepository;
        this.caseAssessmentService = caseAssessmentService;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!seedEnabled) {
            logger.warn("=================================================");
            logger.warn("Data seeding is disabled. No data will be generated!");
            logger.warn("Set risktrace.seed.enabled=true in application.properties");
            logger.warn("=================================================");
            return;
        }

        logger.info("Starting data seed process...");

        // 1. Clear existing data in correct order to respect constraints
        clearData();

        // 2. Generate Base Data
        Merchant merchant = createMerchant();
        List<Customer> customers = createCustomers(50);
        List<OrderRecord> orders = createOrders(customers, merchant, 100);
        List<Payment> payments = createPayments(orders);
        List<Shipment> shipments = createShipments(orders);

        // 3. Generate Disputes
        createDisputes(merchant, payments, orders, shipments);
        
        logger.info("Evaluating seeded disputes via Case Assessment Engine...");
        disputeRepository.findAll().forEach(d -> caseAssessmentService.assessCase(d.getId()));
        
        logger.info("Data seeding completed successfully!");
    }

    private void clearData() {
        logger.info("Clearing existing data...");
        evidenceRepository.deleteAllInBatch();
        investigationSessionRepository.deleteAllInBatch();
        auditEventRepository.deleteAllInBatch();
        disputeRepository.deleteAllInBatch();
        shipmentRepository.deleteAllInBatch();
        paymentRepository.deleteAllInBatch();
        orderRepository.deleteAllInBatch();
        customerRepository.deleteAllInBatch();
        merchantRepository.deleteAllInBatch();
    }

    private Merchant createMerchant() {
        Merchant merchant = new Merchant();
        merchant.setName("Razorpay Demo Store");
        merchant.setEmail("admin@razorpaydemostore.com");
        return merchantRepository.save(merchant);
    }

    private List<Customer> createCustomers(int count) {
        List<Customer> customers = new ArrayList<>();
        String[] firstNames = {"Aarav", "Rohan", "Sneha", "Priya", "Vikram", "Anjali", "Karan", "Pooja", "Rahul", "Neha", "Amit", "Kavya"};
        String[] lastNames = {"Sharma", "Verma", "Singh", "Patel", "Reddy", "Gupta", "Nair", "Rao", "Jain", "Mehta"};
        
        for (int i = 0; i < count; i++) {
            Customer c = new Customer();
            String fName = firstNames[random.nextInt(firstNames.length)];
            String lName = lastNames[random.nextInt(lastNames.length)];
            c.setName(fName + " " + lName);
            c.setEmail(fName.toLowerCase() + "." + lName.toLowerCase() + i + "@example.com");
            c.setPhone("+9198" + (10000000 + random.nextInt(90000000)));
            customers.add(c);
        }
        return customerRepository.saveAll(customers);
    }

    private List<OrderRecord> createOrders(List<Customer> customers, Merchant merchant, int count) {
        List<OrderRecord> orders = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            OrderRecord order = new OrderRecord();
            order.setOrderNumber("ORD-" + (10000 + i));
            order.setCustomer(customers.get(random.nextInt(customers.size())));
            order.setMerchant(merchant);
            order.setAmount(BigDecimal.valueOf(500 + random.nextInt(9500)));
            order.setCurrency("INR");
            order.setStatus(OrderStatus.values()[random.nextInt(OrderStatus.values().length)]);
            orders.add(order);
        }
        return orderRepository.saveAll(orders);
    }

    private List<Payment> createPayments(List<OrderRecord> orders) {
        List<Payment> payments = new ArrayList<>();
        for (OrderRecord order : orders) {
            Payment p = new Payment();
            p.setOrder(order);
            p.setAmount(order.getAmount());
            p.setCurrency(order.getCurrency());
            p.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            p.setPaymentDate(LocalDateTime.now().minusDays(random.nextInt(30)));
            
            // 70% success, 10% failed, 20% disputed
            int rand = random.nextInt(10);
            if (rand < 7) p.setStatus(PaymentStatus.SUCCESS);
            else if (rand < 8) p.setStatus(PaymentStatus.FAILED);
            else p.setStatus(PaymentStatus.DISPUTED);
            
            payments.add(p);
        }
        return paymentRepository.saveAll(payments);
    }

    private List<Shipment> createShipments(List<OrderRecord> orders) {
        List<Shipment> shipments = new ArrayList<>();
        String[] carriers = {"BlueDart", "Delhivery", "FedEx", "Ekart"};
        
        for (OrderRecord order : orders) {
            if (order.getStatus() == OrderStatus.PENDING || order.getStatus() == OrderStatus.CANCELLED) continue;
            
            Shipment s = new Shipment();
            s.setOrder(order);
            s.setTrackingNumber("TRK" + (10000000 + random.nextInt(90000000)));
            s.setCarrier(carriers[random.nextInt(carriers.length)]);
            s.setEstimatedDelivery(LocalDateTime.now().plusDays(random.nextInt(5)));
            
            if (order.getStatus() == OrderStatus.DELIVERED) {
                s.setStatus(ShipmentStatus.DELIVERED);
                s.setActualDelivery(LocalDateTime.now().minusDays(random.nextInt(10)));
            } else if (order.getStatus() == OrderStatus.SHIPPED) {
                s.setStatus(ShipmentStatus.IN_TRANSIT);
            }
            
            shipments.add(s);
        }
        return shipmentRepository.saveAll(shipments);
    }

    private void createDisputes(Merchant merchant, List<Payment> payments, List<OrderRecord> orders, List<Shipment> shipments) {
        logger.info("Generating specific dispute scenarios...");
        
        // Find payments that are disputed
        List<Payment> disputedPayments = payments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.DISPUTED)
                .toList();

        int i = 0;
        for (Payment payment : disputedPayments) {
            OrderRecord order = payment.getOrder();
            Shipment shipment = shipments.stream().filter(s -> s.getOrder().getId().equals(order.getId())).findFirst().orElse(null);
            
            Dispute d = new Dispute();
            d.setMerchant(merchant);
            d.setPayment(payment);
            d.setAmount(payment.getAmount());
            d.setCurrency(payment.getCurrency());
            d.setStatus(DisputeStatus.NEW);
            d.setDecision(DisputeDecision.PENDING);
            
            // Create different specific cases
            if (i == 0) {
                // 1. Strong Case: Merchant has solid proof
                d.setReason("Product not delivered");
                d.setCompleteness(100);
                d.setStrength(90);
                d = disputeRepository.save(d);
                createEvidence(d, EvidenceType.TRACKING_NUMBER, "Tracking info showing Delivered to Customer", EvidenceStatus.SUPPORTING);
                createEvidence(d, EvidenceType.CUSTOMER_COMMUNICATION, "Email from customer acknowledging receipt", EvidenceStatus.SUPPORTING);
            } else if (i == 1) {
                // 2. Weak Case: Customer claims fraud, but IP and Address match
                d.setReason("Fraudulent transaction");
                d.setCompleteness(80);
                d.setStrength(40);
                d = disputeRepository.save(d);
                createEvidence(d, EvidenceType.LOG_DATA, "Device IP and billing address match exact customer history", EvidenceStatus.SUPPORTING);
                createEvidence(d, EvidenceType.CUSTOMER_COMMUNICATION, "Customer complained after 30 days of usage", EvidenceStatus.CONTRADICTORY);
            } else if (i == 2) {
                // 3. Missing Evidence
                d.setReason("Product not delivered");
                d.setCompleteness(20);
                d.setStrength(10);
                d = disputeRepository.save(d);
                createEvidence(d, EvidenceType.TRACKING_NUMBER, "No tracking link provided by carrier", EvidenceStatus.MISSING);
            } else if (i == 3) {
                // 4. Contradictory Evidence
                d.setReason("Item defective");
                d.setCompleteness(70);
                d.setStrength(50);
                d = disputeRepository.save(d);
                createEvidence(d, EvidenceType.CUSTOMER_COMMUNICATION, "Customer email states item was broken in transit", EvidenceStatus.SUPPORTING);
                createEvidence(d, EvidenceType.OTHER, "Photo from delivery agent shows package perfectly intact at drop-off", EvidenceStatus.CONTRADICTORY);
            } else if (i == 4) {
                // 5. High-Value Urgent Case
                d.setReason("Service not provided");
                d.setAmount(BigDecimal.valueOf(95000)); // High value
                d.setCompleteness(90);
                d.setStrength(75);
                d = disputeRepository.save(d);
                createEvidence(d, EvidenceType.RECEIPT, "Invoice for high-value consulting", EvidenceStatus.SUPPORTING);
            } else if (i >= 5 && i <= 9) {
                // 6. Pattern A: Fraud Ring (Same Device Fingerprint)
                d.setReason("Fraudulent transaction");
                d.setAmount(BigDecimal.valueOf(8000 + random.nextInt(2000))); // High value
                d.setCompleteness(85);
                d.setStrength(30);
                d = disputeRepository.save(d);
                createEvidence(d, EvidenceType.LOG_DATA, "Device Fingerprint: FINGERPRINT-A98B7. IP: 192.168.1.100", EvidenceStatus.SUPPORTING);
                createEvidence(d, EvidenceType.CUSTOMER_COMMUNICATION, "Customer denies making purchase", EvidenceStatus.SUPPORTING);
            } else if (i >= 10 && i <= 15) {
                // 7. Pattern B: Fulfillment Anomaly (Same Carrier, Product not delivered)
                d.setReason("Product not delivered");
                d.setCompleteness(60);
                d.setStrength(20);
                
                // Force carrier to BlueDart for this cluster
                if (shipment != null) {
                    shipment.setCarrier("BlueDart");
                    shipmentRepository.save(shipment);
                }

                d = disputeRepository.save(d);
                createEvidence(d, EvidenceType.TRACKING_NUMBER, "Carrier: BlueDart. Status: Lost in transit.", EvidenceStatus.SUPPORTING);
            } else {
                // Generic cases for the rest
                d.setReason("Unrecognized charge");
                d.setCompleteness(random.nextInt(100));
                d.setStrength(random.nextInt(100));
                d = disputeRepository.save(d);
                createEvidence(d, EvidenceType.RECEIPT, "Standard purchase receipt", EvidenceStatus.UNKNOWN);
            }
            
            // Add an audit event for every dispute
            AuditEvent event = new AuditEvent();
            event.setDispute(d);
            event.setAction("DISPUTE_LOGGED");
            event.setDetails("Dispute logged by bank for " + d.getReason());
            event.setPerformedBy("System");
            auditEventRepository.save(event);
            
            i++;
        }
    }

    private void createEvidence(Dispute dispute, EvidenceType type, String content, EvidenceStatus status) {
        Evidence e = new Evidence();
        e.setDispute(dispute);
        e.setType(type);
        e.setContent(content);
        e.setSource("System Seed");
        e.setStatus(status);
        e.setVerified(status == EvidenceStatus.SUPPORTING);
        evidenceRepository.save(e);
        
        if (dispute.getEvidences() == null) {
            dispute.setEvidences(new ArrayList<>());
        }
        dispute.getEvidences().add(e);
    }
}
