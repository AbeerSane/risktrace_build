import { useState, useRef } from "react";
import { UploadCloud, Loader2, FileCheck } from "lucide-react";
import { uploadEvidence } from "../api/api";

export default function EvidenceUploadButton({ disputeId, onUploadSuccess }) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic client validation
        if (file.size > 5 * 1024 * 1024) {
            alert("File size exceeds 5MB limit.");
            return;
        }
        if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
            alert("Only images and PDFs are allowed.");
            return;
        }

        setUploading(true);
        try {
            const newEvidence = await uploadEvidence(disputeId, file);
            onUploadSuccess(newEvidence);
        } catch (err) {
            console.error(err);
            alert("Failed to upload evidence.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <div style={{ display: 'inline-block' }}>
            <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleFileChange} 
                accept="image/*,application/pdf"
            />
            <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px dashed #a55eea',
                    color: '#a55eea',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '8px',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem', fontWeight: 600, letterSpacing: '1px',
                    transition: 'all 0.2s',
                    textTransform: 'uppercase'
                }}
            >
                {uploading ? (
                    <><Loader2 size={18} style={{ animation: 'spin 2s linear infinite' }} /> Uploading...</>
                ) : (
                    <><UploadCloud size={18} /> Add Evidence</>
                )}
            </button>
        </div>
    );
}
