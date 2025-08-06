import React, { useState, useEffect } from 'react';
import Sidebar from '../components/SideBar';
import AddUserModal from '../components/AddUserModal';
import '../styles/UsersPage.css';
import { FiEdit, FiTrash2, FiPlus} from 'react-icons/fi';
import EditUserModal from '../components/EditUserModal';


const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    <div className="flex-1">
      <Sidebar onToggle={setIsSidebarOpen} />
      <main
        className={`transition-all duration-300 p-4 ${
          isSidebarOpen ? 'ml-64' : 'ml-10'
        }`}
      >
        {/* Header */}
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Users Management</h1>
            <p className="text-sm text-gray-600">Manage all user accounts in the system</p>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by name, category, or serial number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-72"
            />

            {/* Add User Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gray-800 text-white px-3 py-1.5 rounded text-sm flex items-center gap-1"
            >
              <FiPlus />
              Add User
            </button>
          </div>
        </header>

        {/* Table */}
        {loading ? (
          <p className="text-gray-500">Loading users...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white text-xs rounded-lg overflow-hidden shadow-md transform scale-95">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">#</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Full Name</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Email</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Role</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Status</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2 capitalize">{user.role}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : user.status === 'inactive'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleEditUser(user)}
                      >
                        <FiEdit />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modals */}
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