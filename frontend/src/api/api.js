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
