import React, { useState, useEffect } from 'react';
import '../styles/EditAssetModal.css';

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toISOString().split('T')[0];
};

const EditAssetModal = ({ asset, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: '',
    category: '',
    serialNumber: '',
    value: '',
    condition: 'Good',
    purchaseDate: '',
  });

  const [document, setSelectedFile] = useState(null);

  useEffect(() => {
    if (asset) {
      setForm({
        name: asset.name || '',
        category: asset.category || '',
        serialNumber: asset.serialNumber || '',
        value: asset.value || '',
        condition: asset.condition || 'Good',
        purchaseDate: formatDateForInput(asset.purchaseDate),
      });
    }
  }, [asset]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSaveAsset = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('category', form.category);
      formData.append('serialNumber', form.serialNumber);
      formData.append('value', form.value);
      formData.append('condition', form.condition);
      formData.append('purchaseDate', form.purchaseDate);

      if (document) {
        formData.append('document', document);
      }

      const response = await fetch(`http://localhost:5000/api/assets/${asset.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update Asset');
      }

      const updatedAsset = await response.json();
      onSave(updatedAsset);
      onClose();
      alert('Asset updated successfully!');

    } catch (error) {
      console.error(error);
      alert('Failed to update asset!');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Edit Asset</h3>
        <form onSubmit={handleSaveAsset}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Asset Name"
            required
          />
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            required
          />
          <input
            name="serialNumber"
            value={form.serialNumber}
            onChange={handleChange}
            placeholder="Serial Number"
            required
          />
          <input
            name="value"
            value={form.value}
            onChange={handleChange}
            placeholder="Value"
            required
          />
          <select name="condition" value={form.condition} onChange={handleChange}>
            <option value="Good">Good</option>
            <option value="Needs-Repair">Needs Repair</option>
            <option value="Broken">Broken</option>
            <option value="Lost">Lost</option>
          </select>
          <input
            name="purchaseDate"
            type="date"
            value={form.purchaseDate}
            onChange={handleChange}
            required
          />

          <label>Upload New Document (optional)</label>
          <input type="file" onChange={handleFileChange} />

          <div className="modal-actions">
            <button type="submit" className="assign-btn">Save</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAssetModal;
