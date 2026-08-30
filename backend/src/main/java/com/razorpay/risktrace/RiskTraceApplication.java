package com.razorpay.risktrace;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class RiskTraceApplication {

    public static void main(String[] args) {
        SpringApplication.run(RiskTraceApplication.class, args);
    }
}
