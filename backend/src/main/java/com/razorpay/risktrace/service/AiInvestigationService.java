package com.razorpay.risktrace.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.razorpay.risktrace.dto.AIRecommendationDTO;
import com.razorpay.risktrace.dto.VerifiedCasePackageDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class AiInvestigationService {

    private static final Logger logger = LoggerFactory.getLogger(AiInvestigationService.class);
    
    private final DisputeService disputeService;
    private final InvestigationEngineService investigationEngineService;
    private final CaseAssessmentService caseAssessmentService;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    @Value("${risktrace.ai.api-url:https://api.openai.com/v1/chat/completions}")
    private String apiUrl;

    @Value("${risktrace.ai.api-key:}")
    private String apiKey;

    @Value("${risktrace.ai.model:groq/compound}")
    private String aiModel;

    private static final String SYSTEM_PROMPT = """
        You are RiskTrace's dispute investigation analyst.

        Analyze only verified evidence supplied by the backend.

        Never invent facts.
        Never assume missing evidence exists.
        Never modify financial values.
        Never claim evidence that was not supplied.
        Never execute financial actions.

        Distinguish:
        VERIFIED EVIDENCE
        MISSING EVIDENCE
        CONTRADICTORY EVIDENCE.

        Provide reasoning and a recommendation.

        The merchant makes the final decision.
        """;

    public AiInvestigationService(DisputeService disputeService,
                                  InvestigationEngineService investigationEngineService,
                                  CaseAssessmentService caseAssessmentService,
                                  ObjectMapper objectMapper) {
        this.disputeService = disputeService;
        this.investigationEngineService = investigationEngineService;
        this.caseAssessmentService = caseAssessmentService;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    public AIRecommendationDTO investigate(UUID disputeId) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            throw new IllegalStateException("AI API Key is not configured. Please set risktrace.ai.api-key in application.properties");
        }

        try {
            // 1. Build the Verified Case Package deterministically without AI
            VerifiedCasePackageDTO casePackage = new VerifiedCasePackageDTO(
                    disputeService.getDisputeDetails(disputeId),
                    investigationEngineService.investigateDispute(disputeId),
                    caseAssessmentService.assessCase(disputeId)
            );

            String packageJson = objectMapper.writeValueAsString(casePackage);

            // 2. Build the LLM Request
            Map<String, Object> requestBody = Map.of(
                    "model", aiModel,
                    "response_format", Map.of("type", "json_object"),
                    "messages", List.of(
                            Map.of("role", "system", "content", SYSTEM_PROMPT),
                            Map.of("role", "user", "content", "Please analyze this Verified Case Package and provide your JSON recommendation:\n\n" + packageJson)
                    ),
                    "temperature", 0.0 // Deterministic behavior
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .timeout(Duration.ofSeconds(45))
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(requestBody)))
                    .build();

            // 3. Execute the Request
            logger.info("Sending Verified Case Package for Dispute {} to AI Engine...", disputeId);
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                logger.error("AI Provider returned status {}: {}", response.statusCode(), response.body());
                throw new RuntimeException("AI Provider API failed with status " + response.statusCode());
            }

            // 4. Parse Response
            var rootNode = objectMapper.readTree(response.body());
            var messageNode = rootNode.path("choices").get(0).path("message").path("content");
            String aiJsonOutput = messageNode.asText();

            // 5. Validate and Deserialize Server-Side
            return objectMapper.readValue(aiJsonOutput, AIRecommendationDTO.class);

        } catch (java.net.http.HttpTimeoutException e) {
            logger.error("AI Provider timed out.", e);
            throw new RuntimeException("AI Provider timed out after 45 seconds.", e);
        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            logger.error("AI Provider returned malformed JSON.", e);
            throw new RuntimeException("Failed to parse AI response. Ensure AI returns strict JSON.", e);
        } catch (Exception e) {
            logger.error("AI Investigation failed: {}", e.getMessage(), e);
            throw new RuntimeException("AI Investigation failed: " + e.getMessage(), e);
        }
    }
}
