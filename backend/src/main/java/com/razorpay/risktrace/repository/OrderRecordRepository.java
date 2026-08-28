package com.razorpay.risktrace.repository;
import com.razorpay.risktrace.entity.OrderRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface OrderRecordRepository extends JpaRepository<OrderRecord, UUID> {
}
