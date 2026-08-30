package com.razorpay.risktrace.dto;

import com.razorpay.risktrace.enums.EvidenceType;
import java.util.List;
import java.util.UUID;

public record InvestigationResultDTO(
    UUID disputeId,
    List<EvidenceDTO> supportingEvidence,
    List<EvidenceType> missingEvidence,
    List<EvidenceDTO> contradictoryEvidence,
    Integer evidenceCompleteness,
    Integer evidenceStrength,
    String summary
) {}
