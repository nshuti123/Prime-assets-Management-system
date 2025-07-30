// src/components/TransferAssetModal.jsx
import React, { useState } from "react";
import '../styles/TransferAssetModal.css';

const TransferAssetModal = ({ asset, onClose, onTransferSuccess }) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Hardcoded employees
  const employees = [
    { _id: 'e1', name: 'Jane Doe', email: 'jane@company.com' },
    { _id: 'e2', name: 'John Smith', email: 'john@company.com' },
    { _id: 'e3', name: 'Emily Davis', email: 'emily@company.com' }
  ];

  const handleTransfer = () => {
    if (!selectedEmployeeId) {
      setError("Please select an employee.");
      return;
    }

    setLoading(true);

    // Simulate delay for UI feedback
    setTimeout(() => {
      setLoading(false);
      onTransferSuccess({
        assetId: asset._id,
        to: selectedEmployeeId,
        reason
      });
      onClose();
    }, 1000);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Transfer Asset</h3>
        <p><strong>Asset:</strong> {asset.name}</p>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <label>
          New Employee:
          <select
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
          >
            <option value="">-- Select Employee --</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name} ({emp.email})
              </option>
            ))}
          </select>
        </label>

        <label>
          Reason (optional):
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              fontSize: '1rem',
              marginBottom: '20px',
            }}
            rows="3"
          />
        </label>

        <div className="modal-actions">
          <button onClick={onClose} className="cancel-btn">Cancel</button>
          <button onClick={handleTransfer} disabled={loading} className="transfer-btn">
            {loading ? "Transferring..." : "Transfer"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferAssetModal;
