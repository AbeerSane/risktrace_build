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
        <div style={{ fontFamily: 'var(--font-sans)', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, letterSpacing: '-0.03em', color: 'var(--text-main)' }}>Disputes Engine</h1>
                        <span className="rt-badge rt-badge-neutral">{disputes.length} CASES</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.85rem' }}>Real-time payment dispute intake, anomaly scoring, and automated contest dossiers</p>
                </div>
                <button 
                    onClick={() => navigate('/disputes/new')}
                    className="rt-btn-primary"
                    style={{ padding: '0.75rem 1.25rem', fontSize: '0.85rem', fontWeight: 600 }}
                >
                    + NEW CASE
                </button>
            </header>

            {/* Control Bar */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
                    <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                        type="text" 
                        placeholder="Search by ID, Merchant, Reason..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="rt-input"
                        style={{ paddingLeft: '2.5rem' }}
                    />
                </div>
                
                <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rt-input"
                    style={{ width: 'auto', minWidth: '160px', cursor: 'pointer' }}
                >
                    <option value="" style={{ background: '#0F0E17' }}>All Statuses</option>
                    <option value="NEW" style={{ background: '#0F0E17' }}>New</option>
                    <option value="INVESTIGATING" style={{ background: '#0F0E17' }}>Investigating</option>
                    <option value="REQUIRES_ACTION" style={{ background: '#0F0E17' }}>Requires Action</option>
                    <option value="WON" style={{ background: '#0F0E17' }}>Won</option>
                    <option value="LOST" style={{ background: '#0F0E17' }}>Lost</option>
                </select>

                <select 
                    value={priorityFilter} 
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="rt-input"
                    style={{ width: 'auto', minWidth: '160px', cursor: 'pointer' }}
                >
                    <option value="" style={{ background: '#0F0E17' }}>All Priorities</option>
                    <option value="LOW" style={{ background: '#0F0E17' }}>Low</option>
                    <option value="MEDIUM" style={{ background: '#0F0E17' }}>Medium</option>
                    <option value="HIGH" style={{ background: '#0F0E17' }}>High</option>
                </select>
            </div>

            {/* Data Table */}
            <div className="rt-card" style={{ overflow: 'hidden', padding: 0 }}>
                {loading && (
                    <div style={{ padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--accent-violet)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }}></div>
                        <div style={{ color: 'var(--accent-violet)', letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 600 }}>Syncing telemetry stream...</div>
                    </div>
                )}
                {!loading && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: 'rgba(255,255,255,0.02)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>
                            <tr>
                                <th style={{ padding: '1rem 1.25rem', cursor: 'pointer' }}>Dispute ID</th>
                                <th style={{ padding: '1rem 1.25rem', cursor: 'pointer' }} onClick={() => handleSort('amount')}>Amount {sortField === 'amount' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</th>
                                <th style={{ padding: '1rem 1.25rem' }}>Reason</th>
                                <th style={{ padding: '1rem 1.25rem', cursor: 'pointer' }} onClick={() => handleSort('status')}>Status {sortField === 'status' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</th>
                                <th style={{ padding: '1rem 1.25rem' }}>Priority</th>
                                <th style={{ padding: '1rem 1.25rem', cursor: 'pointer' }} onClick={() => handleSort('strength')}>Strength {sortField === 'strength' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</th>
                                <th style={{ padding: '1rem 1.25rem', cursor: 'pointer' }} onClick={() => handleSort('createdAt')}>Deadline {sortField === 'createdAt' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</th>
                                <th style={{ padding: '1rem 1.25rem' }}>AI Advice</th>
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
                                        style={{ 
                                            borderTop: '1px solid var(--border-subtle)', 
                                            transition: 'background 0.15s ease', 
                                            cursor: 'pointer',
                                            borderLeft: isUrgent ? '3px solid var(--accent-red)' : '3px solid transparent'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                    >
                                        <td style={{ padding: '1rem 1.25rem', color: isUrgent ? 'var(--accent-red)' : 'var(--accent-violet)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600 }}>
                                            {d.id.substring(0,8)}
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem', color: 'var(--text-main)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                                            {formatter.format(d.amount)}
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                            {d.reason.length > 28 ? d.reason.substring(0, 28) + '...' : d.reason}
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <span className={`rt-badge ${d.status === 'REQUIRES_ACTION' ? 'rt-badge-warning' : d.status === 'WON' ? 'rt-badge-success' : d.status === 'LOST' ? 'rt-badge-danger' : 'rt-badge-neutral'}`}>
                                                {d.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: d.priorityLevel === 'HIGH' ? 'var(--accent-red)' : d.priorityLevel === 'MEDIUM' ? 'var(--accent-amber)' : 'var(--accent-green)' }}></div>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{d.priorityLevel}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{ width: '80px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', height: '5px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${d.strength}%`, height: '100%', background: d.strength > 70 ? 'var(--accent-green)' : d.strength > 40 ? 'var(--accent-amber)' : 'var(--accent-red)' }}></div>
                                                </div>
                                                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{d.strength}%</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem', color: isUrgent ? 'var(--accent-red)' : 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
                                            {deadlineStr}
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <span style={{ color: d.decision === 'CONTEST' ? 'var(--accent-green)' : d.decision === 'CONCEDE' ? 'var(--accent-red)' : 'var(--accent-amber)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.04em' }}>
                                                {d.decision}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredDisputes.length === 0 && (
                                <tr>
                                    <td colSpan="8" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '50%', border: '1px solid var(--border-subtle)' }}>
                                                <Search size={28} opacity={0.4} />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.25rem', fontWeight: 600 }}>No Matching Records</div>
                                                <div style={{ fontSize: '0.85rem' }}>Adjust your filters or search query to locate telemetry data.</div>
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
