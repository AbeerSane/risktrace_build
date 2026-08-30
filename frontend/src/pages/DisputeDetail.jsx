import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchDisputeDetails } from "../api/api";

export default function DisputeDetail() {
    const { id } = useParams();
    const [dispute, setDispute] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDisputeDetails(id)
            .then((data) => {
                setDispute(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div>Loading dispute {id}...</div>;
    if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
    if (!dispute) return <div>Dispute not found</div>;

    return (
        <div>
            <Link to="/disputes" style={{ textDecoration: "none", color: "blue", marginBottom: "1rem", display: "inline-block" }}>
                &larr; Back to Disputes
            </Link>
            <h2>Dispute Details: {dispute.id}</h2>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginTop: "1rem" }}>
                <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
                    <h3>General Info</h3>
                    <p><strong>Merchant:</strong> {dispute.merchant?.name}</p>
                    <p><strong>Reason:</strong> {dispute.reason}</p>
                    <p><strong>Amount:</strong> {dispute.amount} {dispute.currency}</p>
                    <p><strong>Status:</strong> {dispute.status}</p>
                </div>
                
                <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
                    <h3>Risk Assessment</h3>
                    <p><strong>Priority Score:</strong> {dispute.priorityScore}</p>
                    <p><strong>Strength:</strong> {dispute.strength}</p>
                    <p><strong>Completeness:</strong> {dispute.completeness}</p>
                </div>
            </div>

            <div style={{ marginTop: "2rem" }}>
                <h3>Evidence</h3>
                {dispute.evidences && dispute.evidences.length > 0 ? (
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                        {dispute.evidences.map((e) => (
                            <li key={e.id} style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                                <strong>{e.type}</strong> - {e.url} ({e.status})
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No evidence provided.</p>
                )}
            </div>
        </div>
    );
}
