package com.razorpay.risktrace.service;

import com.razorpay.risktrace.dto.MerchantDTO;
import com.razorpay.risktrace.entity.Merchant;
import com.razorpay.risktrace.exception.ResourceNotFoundException;
import com.razorpay.risktrace.repository.MerchantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class MerchantService {
    
    private final MerchantRepository merchantRepository;
    
    public MerchantService(MerchantRepository merchantRepository) {
        this.merchantRepository = merchantRepository;
    }
    
    public MerchantDTO getMerchant(UUID id) {
        Merchant merchant = merchantRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Merchant not found with id: " + id));
        return new MerchantDTO(merchant.getId(), merchant.getName(), merchant.getEmail());
    }
}
