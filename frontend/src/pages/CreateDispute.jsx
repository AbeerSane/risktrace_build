import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDisputeCase } from "../api/api";
import { ArrowLeft, Send, ShieldAlert, Package, CreditCard, User, Loader2 } from "lucide-react";

export default function CreateDispute() {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        customerName: "Jane Doe",
        customerEmail: "jane.doe@example.com",
        customerPhone: "+15550198274",

        orderAmount: "499.99",
        orderCurrency: "USD",
        orderStatus: "COMPLETED",

        paymentMethod: "Visa ending in 4242",
        ipAddress: "192.168.1.45",
        is3dsAuthenticated: false,
        cvvMatched: true,

        shipmentTracking: "TRK9876543210",
        shipmentCarrier: "FedEx",
        shipmentStatus: "DELIVERED",
        shipmentAddress: "123 Main St, Springfield, IL 62701",

        disputeReason: "FRAUDULENT_TRANSACTION"
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const result = await createDisputeCase(formData);
            navigate(`/disputes`);
        } catch (err) {
            console.error(err);
            alert("Failed to submit custom case");
            setSubmitting(false);
        }
    };

    return (
        <div style={{ padding: '2rem 0', maxWidth: '900px', margin: '0 auto', color: 'var(--text-main)', fontFamily: 'var(--font-sans)' }}>
            <button 
                onClick={() => navigate('/disputes')} 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', padding: 0, fontSize: '0.85rem', fontWeight: 500 }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-main)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
                <ArrowLeft size={16} /> Back to Disputes Ledger
            </button>

            <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, letterSpacing: '-0.03em', color: 'var(--text-main)' }}>Inject Dispute Dossier</h1>
                    <span className="rt-badge rt-badge-violet">MANUAL INGESTION</span>
                </div>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>Submit custom case parameters directly into the RiskTrace autonomous investigation pipeline.</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                <div className="rt-card" style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                            <User size={15} color="var(--accent-violet)" />
                        </div>
                        <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: 600, letterSpacing: '-0.01em' }}>Customer Profile</h3>
                    </div>
                    <div style={gridStyle}>
                        <Input label="Customer Full Name" name="customerName" value={formData.customerName} onChange={handleChange} required />
                        <Input label="Email Address" name="customerEmail" type="email" value={formData.customerEmail} onChange={handleChange} required />
                        <Input label="Phone Number" name="customerPhone" value={formData.customerPhone} onChange={handleChange} />
                    </div>
                </div>

                <div className="rt-card" style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                            <CreditCard size={15} color="var(--accent-violet)" />
                        </div>
                        <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: 600, letterSpacing: '-0.01em' }}>Transaction & Dispute Metadata</h3>
                    </div>
                    <div style={gridStyle}>
                        <Input label="Amount" name="orderAmount" type="number" step="0.01" value={formData.orderAmount} onChange={handleChange} required />
                        <Input label="Currency" name="orderCurrency" value={formData.orderCurrency} onChange={handleChange} required />
                        <Select label="Dispute Reason" name="disputeReason" value={formData.disputeReason} onChange={handleChange} options={['FRAUDULENT_TRANSACTION', 'PRODUCT_NOT_RECEIVED', 'PRODUCT_UNACCEPTABLE', 'SUBSCRIPTION_CANCELED']} />
                        
                        <Input label="Payment Method" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} />
                        <Input label="Origin IP Address" name="ipAddress" value={formData.ipAddress} onChange={handleChange} />
                        
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginTop: '1rem', gridColumn: '1 / -1' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                <input type="checkbox" name="is3dsAuthenticated" checked={formData.is3dsAuthenticated} onChange={handleChange} style={{ accentColor: 'var(--accent-violet)' }} />
                                3D Secure Authenticated
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                <input type="checkbox" name="cvvMatched" checked={formData.cvvMatched} onChange={handleChange} style={{ accentColor: 'var(--accent-violet)' }} />
                                CVV Match Confirmed
                            </label>
                        </div>
                    </div>
                </div>

                <div className="rt-card" style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                            <Package size={15} color="var(--accent-violet)" />
                        </div>
                        <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: 600, letterSpacing: '-0.01em' }}>Fulfillment & Delivery</h3>
                    </div>
                    <div style={gridStyle}>
                        <Input label="Carrier Tracking #" name="shipmentTracking" value={formData.shipmentTracking} onChange={handleChange} />
                        <Input label="Shipping Carrier" name="shipmentCarrier" value={formData.shipmentCarrier} onChange={handleChange} />
                        <Select label="Fulfillment Status" name="shipmentStatus" value={formData.shipmentStatus} onChange={handleChange} options={['PENDING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'RETURNED']} />
                        <div style={{ gridColumn: '1 / -1' }}>
                            <Input label="Destination Address" name="shipmentAddress" value={formData.shipmentAddress} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    <button 
                        type="submit" 
                        disabled={submitting}
                        className="rt-btn-primary"
                        style={{ 
                            padding: '1rem 2rem', 
                            fontSize: '0.95rem',
                            letterSpacing: '0.04em'
                        }}
                    >
                        {submitting ? <><Loader2 size={18} style={{ animation: 'spin 1.5s linear infinite' }} /> Ingesting Telemetry...</> : <><Send size={18} /> Ingest Case Telemetry</>}
                    </button>
                </div>

            </form>
        </div>
    );
}

const gridStyle = {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem'
};

function Input({ label, ...props }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{label}</label>
            <input 
                {...props} 
                className="rt-input"
            />
        </div>
    );
}

function Select({ label, options, ...props }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{label}</label>
            <select 
                {...props} 
                className="rt-input"
                style={{ cursor: 'pointer' }}
            >
                {options.map(opt => <option key={opt} value={opt} style={{ background: '#0F0E17' }}>{opt}</option>)}
            </select>
        </div>
    );
}
