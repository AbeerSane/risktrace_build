package com.razorpay.risktrace.dto;

import java.util.List;

public record VerifiedCasePackageDTO(
    DisputeDetailsDTO disputeDetails,
    InvestigationResultDTO investigationResult,
    CaseAssessmentDTO caseAssessment
) {}
