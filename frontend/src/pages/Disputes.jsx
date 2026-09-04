import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDisputes } from "../api/api";
import { AlertTriangle, Search } from "lucide-react";

export default function Disputes() {
    const navigate = useNavigate();
    const [disputes, setDisputes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters & State
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [sortField, setSortField] = useState("createdAt");
    const [sortDir, setSortDir] = useState("desc");

    useEffect(() => {
        setLoading(true);
        fetchDisputes(0, 100, `${sortField},${sortDir}`, statusFilter, priorityFilter)
            .then((data) => {
                setDisputes(data.content || []);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [statusFilter, priorityFilter, sortField, sortDir]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDir("desc");
        }
    };

    const filteredDisputes = disputes.filter(d => 
        searchQuery === "" || 
        d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.reason.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

    if (error) return (
        <div className="glass-panel" style={{ color: '#ff4757', padding: '2rem', border: '1px solid rgba(255, 71, 87, 0.4)', backgroundColor: 'rgba(255, 71, 87, 0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem', marginTop: '2rem' }}>
            <AlertTriangle size={48} />
            <h3 style={{ margin: 0, letterSpacing: '2px', textTransform: 'uppercase' }}>System Failure</h3>
            <p style={{ fontFamily: 'monospace', margin: 0, opacity: 0.8 }}>{error}</p>
        </div>
    );

    return (
        <div style={{ fontFamily: 'system-ui, sans-serif' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 300, margin: 0, letterSpacing: '1px', color: '#f1f2f6' }}>Disputes Engine</h1>
                        <p style={{ color: '#747d8c', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>{disputes.length} Active Cases</p>
                    </div>
                    <button 
                        onClick={() => navigate('/disputes/new')}
                        style={{
                            background: '#a55eea', color: 'white', border: 'none', borderRadius: '6px',
                            padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}
                    >
                        + NEW CASE
                    </button>
                </div>
            </header>

            {/* Control Bar */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <input 
                    type="text" 
                    placeholder="Search by ID, Merchant, Reason..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="premium-input"
                    style={{ flex: 1, minWidth: '250px' }}
                />
                
                <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="premium-input"
                    style={{ cursor: 'pointer' }}
                >
                    <option value="" style={{ background: '#1a1a24' }}>All Statuses</option>
                    <option value="NEW" style={{ background: '#1a1a24' }}>New</option>
                    <option value="INVESTIGATING" style={{ background: '#1a1a24' }}>Investigating</option>
                    <option value="REQUIRES_ACTION" style={{ background: '#1a1a24' }}>Requires Action</option>
                    <option value="WON" style={{ background: '#1a1a24' }}>Won</option>
                    <option value="LOST" style={{ background: '#1a1a24' }}>Lost</option>
                </select>

                <select 
                    value={priorityFilter} 
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="premium-input"
                    style={{ cursor: 'pointer' }}
                >
                    <option value="" style={{ background: '#1a1a24' }}>All Priorities</option>
                    <option value="LOW" style={{ background: '#1a1a24' }}>Low</option>
                    <option value="MEDIUM" style={{ background: '#1a1a24' }}>Medium</option>
                    <option value="HIGH" style={{ background: '#1a1a24' }}>High</option>
                </select>
            </div>

            {/* Data Table */}
            <div className="glass-panel" style={{ overflow: 'hidden' }}>
                {loading && <div style={{ padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}><div className="cyber-loader"></div><div style={{ color: '#a55eea', letterSpacing: '2px', textTransform: 'uppercase' }}>Syncing telemetry...</div></div>}
                {!loading && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: 'rgba(0,0,0,0.4)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#747d8c' }}>
                            <tr>
                                <th style={{ padding: '1.2rem 1rem', cursor: 'pointer' }}>Dispute ID</th>
                                <th style={{ padding: '1.2rem 1rem', cursor: 'pointer' }} onClick={() => handleSort('amount')}>Amount {sortField === 'amount' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</th>
                                <th style={{ padding: '1.2rem 1rem' }}>Reason</th>
                                <th style={{ padding: '1.2rem 1rem', cursor: 'pointer' }} onClick={() => handleSort('status')}>Status {sortField === 'status' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</th>
                                <th style={{ padding: '1.2rem 1rem' }}>Priority</th>
                                <th style={{ padding: '1.2rem 1rem', cursor: 'pointer' }} onClick={() => handleSort('strength')}>Strength {sortField === 'strength' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</th>
                                <th style={{ padding: '1.2rem 1rem', cursor: 'pointer' }} onClick={() => handleSort('createdAt')}>Deadline {sortField === 'createdAt' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</th>
                                <th style={{ padding: '1.2rem 1rem' }}>AI Advice</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDisputes.map(d => {
                                const isUrgent = d.urgencyLevel === 'HIGH';
                                const deadlineDate = new Date(new Date(d.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000);
                                const deadlineStr = deadlineDate.toLocaleDateString();

                                return (
                                    <tr 
                                        key={d.id} 
                                        onClick={() => navigate(`/disputes/${d.id}`)}
                                        onMouseOver={e => {
                                            e.currentTarget.style.background = isUrgent ? 'rgba(255, 71, 87, 0.1)' : 'rgba(170, 59, 255, 0.1)';
                                            e.currentTarget.style.transform = 'scale(1.002)';
                                        }}
                                        onMouseOut={e => {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.transform = 'scale(1)';
                                        }}
                                        style={{ 
                                            borderTop: '1px solid rgba(255,255,255,0.05)', 
                                            transition: 'all 0.2s', cursor: 'pointer',
                                            borderLeft: isUrgent ? '3px solid #ff4757' : '3px solid transparent',
                                            boxShadow: isUrgent ? 'inset 20px 0 30px -20px rgba(255, 71, 87, 0.2)' : 'none'
                                        }}
                                    >
                                        <td style={{ padding: '1rem', color: isUrgent ? '#ff4757' : '#a55eea', fontFamily: 'monospace' }}>
                                            {d.id.substring(0,8)}
                                        </td>
                                        <td style={{ padding: '1rem', color: '#f1f2f6', fontWeight: 500 }}>
                                            {formatter.format(d.amount)}
                                        </td>
                                        <td style={{ padding: '1rem', color: '#ccc', fontSize: '0.9rem' }}>
                                            {d.reason.length > 25 ? d.reason.substring(0, 25) + '...' : d.reason}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ 
                                                fontSize: '0.7rem', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '1px',
                                                background: d.status === 'REQUIRES_ACTION' ? 'rgba(243, 156, 18, 0.2)' : 'rgba(255,255,255,0.05)', 
                                                color: d.status === 'REQUIRES_ACTION' ? '#f39c12' : '#747d8c',
                                                border: d.status === 'REQUIRES_ACTION' ? '1px solid rgba(243, 156, 18, 0.5)' : '1px solid transparent'
                                            }}>
                                                {d.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.priorityLevel === 'HIGH' ? '#e74c3c' : d.priorityLevel === 'MEDIUM' ? '#f39c12' : '#2ecc71' }}></div>
                                                <span style={{ fontSize: '0.8rem', color: '#ccc' }}>{d.priorityLevel}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                                                <div style={{ width: `${d.strength}%`, height: '100%', background: d.strength > 70 ? '#2ecc71' : d.strength > 40 ? '#f39c12' : '#e74c3c' }}></div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', color: isUrgent ? '#ff4757' : '#747d8c', fontSize: '0.9rem' }}>
                                            {deadlineStr}
                                        </td>
                                        <td style={{ padding: '1rem', color: d.decision === 'CONTEST' ? '#2ecc71' : d.decision === 'CONCEDE' ? '#e74c3c' : '#f39c12', fontWeight: 600, fontSize: '0.8rem' }}>
                                            {d.decision}
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredDisputes.length === 0 && (
                                <tr>
                                    <td colSpan="8" style={{ padding: '4rem 2rem', textAlign: 'center', color: '#747d8c' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '50%' }}>
                                                <Search size={32} opacity={0.5} />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '1.1rem', color: '#f1f2f6', marginBottom: '0.5rem' }}>No Matches Found</div>
                                                <div style={{ fontSize: '0.9rem' }}>Adjust your filters or search query to locate telemetry data.</div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
