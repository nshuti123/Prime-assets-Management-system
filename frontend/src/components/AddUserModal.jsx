import React, { useState } from 'react';
import '../styles/AddUserModal.css';
import axios from 'axios';

const AddUserModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPass: '',
    role: 'Employee',
    status: 'Active',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPass) {
      setError('Please fill in all fields.');
      return;
    }

    if (form.password !== form.confirmPass) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        status: form.status,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log(response.data);

      // Add the user to the local list
      onAdd(response.data.user);

      alert('User successfully added!');
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to add user.');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Add New User</h3>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <input name="confirmPass" type="password" placeholder="Confirm Password" value={form.confirmPass} onChange={handleChange} required />

          <select name="role" value={form.role} onChange={handleChange}>
            <option value="Admin">Admin</option>
            <option value="Employee">Employee</option>
          </select>

          <select name="status" value={form.status} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <div className="modal-actions">
            <button type="submit" className="assign-btn">Add</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
