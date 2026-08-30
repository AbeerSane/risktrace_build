export const API_BASE = "http://localhost:8080/api";

export async function fetchDisputes(page = 0, size = 20) {
    const res = await fetch(`${API_BASE}/disputes?page=${page}&size=${size}`);
    if (!res.ok) throw new Error("Failed to fetch disputes");
    return res.json();
}

export async function fetchDisputeDetails(id) {
    const res = await fetch(`${API_BASE}/disputes/${id}`);
    if (!res.ok) throw new Error("Failed to fetch dispute details");
    return res.json();
}
