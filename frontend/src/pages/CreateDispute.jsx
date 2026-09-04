import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDisputeCase } from "../api/api";
import { ArrowLeft, Send, ShieldAlert, Package, CreditCard, User } from "lucide-react";

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
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', color: '#f1f2f6', fontFamily: 'system-ui, sans-serif' }}>
            <button onClick={() => navigate('/disputes')} style={{ background: 'transparent', border: 'none', color: '#747d8c', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', padding: 0 }}>
                <ArrowLeft size={16} /> Back to Command Center
            </button>

            <h1 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: '0.5rem', color: '#a55eea' }}>Inject Custom Case</h1>
            <p style={{ color: '#747d8c', marginBottom: '3rem', fontSize: '1.1rem' }}>Submit a manual dispute case into the AI pipeline for assessment.</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                <div style={sectionStyle}>
                    <h3 style={headerStyle}><User size={18}/> Customer Profile</h3>
                    <div style={gridStyle}>
                        <Input label="Name" name="customerName" value={formData.customerName} onChange={handleChange} required />
                        <Input label="Email" name="customerEmail" type="email" value={formData.customerEmail} onChange={handleChange} required />
                        <Input label="Phone" name="customerPhone" value={formData.customerPhone} onChange={handleChange} />
                    </div>
                </div>

                <div style={sectionStyle}>
                    <h3 style={headerStyle}><CreditCard size={18}/> Transaction & Dispute</h3>
                    <div style={gridStyle}>
                        <Input label="Amount" name="orderAmount" type="number" step="0.01" value={formData.orderAmount} onChange={handleChange} required />
                        <Input label="Currency" name="orderCurrency" value={formData.orderCurrency} onChange={handleChange} required />
                        <Select label="Dispute Reason" name="disputeReason" value={formData.disputeReason} onChange={handleChange} options={['FRAUDULENT_TRANSACTION', 'PRODUCT_NOT_RECEIVED', 'PRODUCT_UNACCEPTABLE', 'SUBSCRIPTION_CANCELED']} />
                        
                        <Input label="Payment Method" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} />
                        <Input label="IP Address" name="ipAddress" value={formData.ipAddress} onChange={handleChange} />
                        
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginTop: '1.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#ccc' }}>
                                <input type="checkbox" name="is3dsAuthenticated" checked={formData.is3dsAuthenticated} onChange={handleChange} />
                                3D Secure Authenticated
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#ccc' }}>
                                <input type="checkbox" name="cvvMatched" checked={formData.cvvMatched} onChange={handleChange} />
                                CVV Matched
                            </label>
                        </div>
                    </div>
                </div>

                <div style={sectionStyle}>
                    <h3 style={headerStyle}><Package size={18}/> Fulfillment Details</h3>
                    <div style={gridStyle}>
                        <Input label="Tracking Number" name="shipmentTracking" value={formData.shipmentTracking} onChange={handleChange} />
                        <Input label="Carrier" name="shipmentCarrier" value={formData.shipmentCarrier} onChange={handleChange} />
                        <Select label="Status" name="shipmentStatus" value={formData.shipmentStatus} onChange={handleChange} options={['PENDING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'RETURNED']} />
                        <div style={{ gridColumn: '1 / -1' }}>
                            <Input label="Shipping Address" name="shipmentAddress" value={formData.shipmentAddress} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={submitting}
                    style={{ 
                        background: 'linear-gradient(90deg, #a55eea, #7b2cbf)', 
                        border: 'none', borderRadius: '30px', 
                        padding: '1rem 2.5rem', color: 'white', 
                        fontSize: '1.1rem', cursor: submitting ? 'not-allowed' : 'pointer',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        boxShadow: '0 4px 15px rgba(170, 59, 255, 0.4)',
                        textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600,
                        alignSelf: 'flex-start', marginTop: '1rem', opacity: submitting ? 0.7 : 1
                    }}
                >
                    {submitting ? 'Injecting Data...' : <><Send size={20} /> Inject Case Data</>}
                </button>

            </form>
        </div>
    );
}

const sectionStyle = {
    background: 'rgba(20, 18, 25, 0.8)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)'
};

const headerStyle = {
    margin: '0 0 1.5rem 0', color: '#a55eea', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', fontWeight: 400
};

const gridStyle = {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem'
};

function Input({ label, ...props }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', color: '#747d8c', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</label>
            <input 
                {...props} 
                style={{ 
                    background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', 
                    padding: '0.8rem', color: '#f1f2f6', fontSize: '1rem', outline: 'none'
                }} 
                onFocus={(e) => e.target.style.borderColor = '#a55eea'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
        </div>
    );
}

function Select({ label, options, ...props }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', color: '#747d8c', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</label>
            <select 
                {...props} 
                style={{ 
                    background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', 
                    padding: '0.8rem', color: '#f1f2f6', fontSize: '1rem', outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#a55eea'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            >
                {options.map(opt => <option key={opt} value={opt} style={{ background: '#1a1a24' }}>{opt}</option>)}
            </select>
        </div>
    );
}
