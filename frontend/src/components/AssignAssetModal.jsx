import React, { useState } from 'react';
import '../styles/AssignAssetModal.css';

const AssignAssetModal = ({ asset, employees, onClose, onAssign }) => {
  const [selectedEmployee, setSelectedEmployee] = useState('');

  const handleAssign = () => {
    if (!selectedEmployee) return;
    onAssign(asset.id, selectedEmployee);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Assign Asset: {asset.name}</h3>
        <label>Select Employee:</label>
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          <option value="">-- Select --</option>
          {Array.isArray(employees) && employees.map(emp => (
  <option key={emp.id} value={emp.id}>
    {emp.name}
  </option>
))}

        </select>

        <div className="modal-actions">
          <button onClick={handleAssign} className="assign-btn">Assign</button>
          <button onClick={onClose} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AssignAssetModal;
