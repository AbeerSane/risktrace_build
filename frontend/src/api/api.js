export const API_BASE = "http://localhost:8080/api";

export async function fetchDisputes(page = 0, size = 100, sort = "createdAt,desc", status = "", priorityLevel = "") {
    let url = `${API_BASE}/disputes?page=${page}&size=${size}&sort=${sort}`;
    if (status) url += `&status=${status}`;
    if (priorityLevel) url += `&priorityLevel=${priorityLevel}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch disputes");
    return res.json();
}

export async function fetchDisputeDetails(id) {
    const res = await fetch(`${API_BASE}/disputes/${id}`);
    if (!res.ok) throw new Error("Failed to fetch dispute details");
    return res.json();
}

export async function fetchDashboardMetrics() {
    const res = await fetch(`${API_BASE}/dashboard`);
    if (!res.ok) throw new Error("Failed to fetch dashboard metrics");
    return res.json();
}

export async function startInvestigation(id) {
    const res = await fetch(`${API_BASE}/disputes/${id}/investigate-async`, { method: 'POST' });
    if (!res.ok) throw new Error("Failed to start investigation");
    return res.json();
}

export async function pollInvestigation(sessionId) {
    const res = await fetch(`${API_BASE}/investigations/${sessionId}`);
    if (!res.ok) throw new Error("Failed to poll investigation");
    return res.json();
}

export async function submitDecision(id, decision, aiRecommendation) {
    const res = await fetch(`${API_BASE}/disputes/${id}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, aiRecommendation })
    });
    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to submit decision");
    }
    return res;
}

export async function fetchAudits(id) {
    const res = await fetch(`${API_BASE}/disputes/${id}/audits`);
    if (!res.ok) throw new Error("Failed to fetch audits");
    return res.json();
}

export async function createDisputeCase(payload) {
    const res = await fetch(`${API_BASE}/disputes/intake`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Failed to create dispute case");
    return res.json();
}

export async function uploadEvidence(disputeId, file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await fetch(`${API_BASE}/disputes/${disputeId}/evidence/upload`, {
        method: 'POST',
        body: formData
    });
    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to upload evidence");
    }
    return res.json();
}

export async function acceptEvidence(disputeId, evidenceId) {
    const res = await fetch(`${API_BASE}/disputes/${disputeId}/evidence/${evidenceId}/accept`, {
        method: 'POST'
    });
    if (!res.ok) throw new Error("Failed to accept evidence");
    return res.json();
}

export async function fetchPatterns() {
    const res = await fetch(`${API_BASE}/patterns`);
    if (!res.ok) throw new Error("Failed to fetch patterns");
    return res.json();
}
