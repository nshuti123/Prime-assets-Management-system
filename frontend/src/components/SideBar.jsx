import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaBoxes, FaUserAlt, FaCog, FaSignOutAlt, FaHistory } from 'react-icons/fa';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    navigate('/'); // Redirect to login page
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <NavLink to="/admin" style = {{color: 'white', textDecoration: 'none'}}>
          <span>ADMIN PANEL</span>
        </NavLink>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/assets" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
  <FaBoxes className="icon" />
  <span>Assets</span>
</NavLink>

        <NavLink to="/users" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <FaUserAlt className="icon" />
          <span>Users</span>
        </NavLink>
        <NavLink to="/assignments" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <FaHistory className="icon" />
          <span>Assignment History</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <FaCog className="icon" />
          <span>Settings</span>
        </NavLink>
          <button 
          onClick={handleLogout} 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-Link"} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', gap: '0.2rem' }}
        >
          <FaSignOutAlt style={{margin: '10px 14px'}} className="icon" />
            <span style = {{margin: '7px -2px'}}>Logout</span>

          </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
