import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchDisputes } from "../api/api";

export default function Disputes() {
    const [disputes, setDisputes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDisputes()
            .then((data) => {
                setDisputes(data.content || []);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading disputes...</div>;
    if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

    return (
        <div>
            <h2>Disputes</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
                <thead>
                    <tr style={{ borderBottom: "2px solid #ccc", textAlign: "left" }}>
                        <th style={{ padding: "8px" }}>ID</th>
                        <th style={{ padding: "8px" }}>Merchant</th>
                        <th style={{ padding: "8px" }}>Amount</th>
                        <th style={{ padding: "8px" }}>Reason</th>
                        <th style={{ padding: "8px" }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {disputes.map((d) => (
                        <tr key={d.id} style={{ borderBottom: "1px solid #eee" }}>
                            <td style={{ padding: "8px" }}><Link to={`/disputes/${d.id}`}>{d.id.substring(0, 8)}...</Link></td>
                            <td style={{ padding: "8px" }}>{d.merchantName}</td>
                            <td style={{ padding: "8px" }}>{d.amount} {d.currency}</td>
                            <td style={{ padding: "8px" }}>{d.reason}</td>
                            <td style={{ padding: "8px" }}>{d.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
