package com.razorpay.risktrace.entity;
import com.razorpay.risktrace.enums.DisputeStatus;
import com.razorpay.risktrace.enums.DisputeDecision;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;

@Entity
@Table(name = "disputes")
public class Dispute {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    
    @ManyToOne @JoinColumn(name = "merchant_id") private Merchant merchant;
    @ManyToOne @JoinColumn(name = "payment_id") private Payment payment;
    
    private String reason;
    private BigDecimal amount;
    private String currency;
    
    @Enumerated(EnumType.STRING) private DisputeStatus status;
    @Enumerated(EnumType.STRING) private DisputeDecision decision;
    
    private Integer priorityScore;
    private String priorityLevel;
    private String urgencyLevel;
    private BigDecimal potentialRecovery;
    private Integer completeness;
    private Integer strength;
    
    @OneToMany(mappedBy = "dispute", cascade = CascadeType.ALL)
    private List<Evidence> evidences;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); updatedAt = createdAt; }
    @PreUpdate protected void onUpdate() { updatedAt = LocalDateTime.now(); }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Merchant getMerchant() { return merchant; }
    public void setMerchant(Merchant merchant) { this.merchant = merchant; }
    public Payment getPayment() { return payment; }
    public void setPayment(Payment payment) { this.payment = payment; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public DisputeStatus getStatus() { return status; }
    public void setStatus(DisputeStatus status) { this.status = status; }
    public DisputeDecision getDecision() { return decision; }
    public void setDecision(DisputeDecision decision) { this.decision = decision; }
    public Integer getPriorityScore() { return priorityScore; }
    public void setPriorityScore(Integer priorityScore) { this.priorityScore = priorityScore; }
    public String getPriorityLevel() { return priorityLevel; }
    public void setPriorityLevel(String priorityLevel) { this.priorityLevel = priorityLevel; }
    public String getUrgencyLevel() { return urgencyLevel; }
    public void setUrgencyLevel(String urgencyLevel) { this.urgencyLevel = urgencyLevel; }
    public BigDecimal getPotentialRecovery() { return potentialRecovery; }
    public void setPotentialRecovery(BigDecimal potentialRecovery) { this.potentialRecovery = potentialRecovery; }
    public Integer getCompleteness() { return completeness; }
    public void setCompleteness(Integer completeness) { this.completeness = completeness; }
    public Integer getStrength() { return strength; }
    public void setStrength(Integer strength) { this.strength = strength; }
    public List<Evidence> getEvidences() { return evidences; }
    public void setEvidences(List<Evidence> evidences) { this.evidences = evidences; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}