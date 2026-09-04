package com.razorpay.risktrace.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@Service
public class DocumentExtractionService {

    public record ExtractionResult(boolean success, List<String> extractedFacts, String rawText) {}

    public ExtractionResult extract(MultipartFile file, String urlPath) {
        // In a real app, this would call AWS Textract, Google Cloud Vision, or Spring AI Document Readers.
        // For the hackathon, we simulate an AI extraction process based on file type.
        
        try {
            // Simulate processing time
            Thread.sleep(800);
            
            String filename = file.getOriginalFilename();
            if (filename != null && filename.toLowerCase().contains("fail")) {
                return new ExtractionResult(false, List.of(), "Could not parse document. Blurry or unsupported format.");
            }

            List<String> facts = List.of(
                    "Document Type: Receipt/Invoice",
                    "Detected Amount: Matches Dispute Value",
                    "Customer Signature: Verified (Confidence 89%)",
                    "Date of Transaction: Within 30 days"
            );

            return new ExtractionResult(true, facts, "Raw extracted text block from OCR engine...");

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return new ExtractionResult(false, List.of(), "Extraction interrupted.");
        }
    }
}
