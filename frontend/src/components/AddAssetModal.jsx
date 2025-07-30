import React, { useState } from 'react';
import '../styles/AddAsset.css';

const AddAssetModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    name: '',
    category: '',
    value: '',
    condition: 'Good',
    purchaseDate: '',
  });

  const [document, setDocument] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('category', form.category);
    formData.append('value', form.value);
    formData.append('condition', form.condition);
    formData.append('purchaseDate', form.purchaseDate);
    if (form.assignedTo) formData.append('assignedTo', form.assignedTo);
    if (document) formData.append('document', document);

    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:5000/api/assets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // ❗ Don't set Content-Type to multipart/form-data, browser handles it automatically when using FormData
      },
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to add asset');
    }

    // Optionally pass the new asset back to parent to update local state
    onAdd(data.asset); 

    alert('Asset Inserted!!!');

    onClose();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Add New Asset</h3>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Asset Name" value={form.name} onChange={handleChange} required />
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
           <input name="serialNumber" placeholder="serialNumber" value={form.serialNumber} onChange={handleChange} required />
          <input name="value" placeholder="Value (e.g. $500)" value={form.value} onChange={handleChange} required />
          <select name="condition" value={form.condition} onChange={handleChange}>
            <option value="Good">Good</option>
            <option value="Needs-Repair">Needs Repair</option>
            <option value="Broken">Broken</option>
            <option value="Lost">Lost</option>
          </select>
          <select name="assignedTo" onChange={handleChange}>
            <option value="">Unassigned</option>
            {/* Map over users */}
          </select>

          <input name="purchaseDate" type="date" value={form.purchaseDate} onChange={handleChange} required />
          <input type="file" name="document" accept=".pdf,.doc,.docx,.jpg,.png" onChange={(e) => setDocument(e.target.files[0])} />

          <div className="modal-actions">
            <button type="submit" className="assign-btn">Add</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssetModal;
