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
                className="rt-btn-secondary"
                style={{
                    width: '100%',
                    justifyContent: 'center',
                    borderStyle: 'dashed',
                    borderColor: 'rgba(139, 92, 246, 0.4)',
                    color: 'var(--accent-violet)',
                    padding: '0.85rem 1rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em'
                }}
            >
                {uploading ? (
                    <><Loader2 size={16} style={{ animation: 'spin 1.5s linear infinite' }} /> Uploading Telemetry...</>
                ) : (
                    <><UploadCloud size={16} /> Upload Case Evidence</>
                )}
            </button>
        </div>
    );
}
