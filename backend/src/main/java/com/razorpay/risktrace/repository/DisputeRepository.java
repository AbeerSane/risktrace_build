package com.razorpay.risktrace.repository;
import com.razorpay.risktrace.entity.Dispute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface DisputeRepository extends JpaRepository<Dispute, UUID>, org.springframework.data.jpa.repository.JpaSpecificationExecutor<Dispute> {
    
    @org.springframework.data.jpa.repository.Query("SELECT COUNT(d) FROM Dispute d")
    long countTotalDisputes();

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(d) FROM Dispute d WHERE d.status = :status")
    long countByStatus(@org.springframework.data.repository.query.Param("status") com.razorpay.risktrace.enums.DisputeStatus status);

    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(d.amount), 0) FROM Dispute d")
    java.math.BigDecimal sumTotalDisputedAmount();

    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(d.amount), 0) FROM Dispute d WHERE d.status NOT IN ('WON', 'LOST')")
    java.math.BigDecimal sumMoneyAtRisk();

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(d) FROM Dispute d WHERE d.priorityLevel = 'HIGH'")
    long countHighPriority();

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(d) FROM Dispute d WHERE d.urgencyLevel = 'HIGH'")
    long countUrgent();

    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(AVG(d.strength), 0) FROM Dispute d")
    Double getAverageStrength();

    java.util.List<Dispute> findTop5ByOrderByCreatedAtDesc();
}
