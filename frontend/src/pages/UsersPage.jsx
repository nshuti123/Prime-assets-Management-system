import React, { useState, useEffect } from 'react';
import SideBar from '../components/SideBar';
import AddUserModal from '../components/AddUserModal';
import '../styles/UsersPage.css';
import { FiEdit, FiTrash2, FiPlus} from 'react-icons/fi';
import EditUserModal from '../components/EditUserModal';


const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/`, { 
  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } 
});


      if (!res.ok) throw new Error('Failed to fetch users');

      const data = await res.json();
      console.log('Users fetched:', data); 
      setUsers(data.users);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchUsers();
}, []);

  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddUser = (newUser) => {
    setUsers([newUser, ...users]);
  };
const [showEditModal, setShowEditModal] = useState(false);
const [selectedUser, setSelectedUser] = useState(null);

const handleEditUser = (user) => {
  setSelectedUser(user);
  setShowEditModal(true);
};

const handleSaveUser = async (updatedUser) => {
  if (!updatedUser.id) {
    console.error("User ID is missing!");
    alert("Cannot update user: ID is undefined");
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/users/${updatedUser.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(updatedUser)
    });

    if (!res.ok) {
      throw new Error('Failed to update user');
    }


    // Update local state
    setUsers(prevUsers => {
  return prevUsers.map(u => (u.id === updatedUser.id ? updatedUser : u));
});

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const handleDeleteUser = async (id) => {
  if (!id) {
    alert("Invalid user ID");
    return;
  }

  if (window.confirm("Are you sure you want to delete this user?")) {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!res.ok) {
        throw new Error('Failed to delete user');
      }

      // Remove from local state
      setUsers(users.filter(user => user.id !== id));
      
      alert("User deleted successfully!");

    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }
};

  const filteredUsers = users.filter(user => 
  user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
  user.status.toLowerCase().includes(searchTerm.toLowerCase())
);


  return (
    <div className="dashboard-wrapper">
      <SideBar />
      <main className="users-main">
        <header className="users-header">
          <div>
            <h1 style={{ margin: 0, fontWeight: '600', fontSize: '1.8rem' }}>Users Management</h1>
          <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Manage all user accounts in the system</p>
          </div>
          <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
  <input
    type="text"
    placeholder="Search by name, category, or serial number..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{
      padding: '0.5rem 1rem',
      borderRadius: '5px',
      border: '1px solid #ccc',
      width: '100%',
      maxWidth: '300px',
      fontSize: '1rem'
    }}
  />
</div>

           <button
              onClick={() => setShowAddModal(true)}
              style={{
                backgroundColor: '#222',
                color: '#fff',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '5px',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#444')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#222')}
            >
              <FiPlus />
              Add User
            </button>
        </header>

        {loading ? (
          <p>Loading users...</p>
            ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
            ) : (

        <table className="users-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <span className={`status ${(user.status || 'Unknown').toLowerCase()}`}>
                    {user.status || 'Unknown'}
                  </span>

                </td>
                <td>
                  <button className="action-btn edit" onClick={() => handleEditUser(user)}>
  <FiEdit />
</button>

                  <button
                    className="action-btn delete"
                    onClick={() => handleDeleteUser(user.id)}
>
                    <FiTrash2 />
                    </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}

        {/* Render Modal when showAddModal is true */}
        {showAddModal && (
          <AddUserModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddUser}
          />
        )}
        {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveUser}
        />

        )}

      </main>
    </div>
  );
};

export default UsersPage;
