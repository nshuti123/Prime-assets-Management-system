// components/AddMultipleAssetsModal.jsx
import React, { useState } from 'react';
import '../styles/AddAsset.css'; // Reuse styling if available

const AddMultipleAssetsModal = ({ onClose, onUpload }) => {
  const [csvFile, setCsvFile] = useState(null);

  const handleUpload = () => {
    if (!csvFile) return alert('Please select a CSV file.');
    onUpload(csvFile);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Upload Multiple Assets</h2>

        <input
          type="file"
          accept=".csv"
          onChange={(e) => setCsvFile(e.target.files[0])}
          className="csv-input"
        />

        <div className="modal-actions">
          <button onClick={handleUpload} className="upload-btn">Upload CSV</button>
          <button onClick={onClose} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddMultipleAssetsModal;
