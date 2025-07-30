import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaLaptop, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const EmployeeSidebar = () => {
    const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    navigate('/'); // Redirect to login page
  };
  return (
    <aside className="sidebar">
      <div className="sidebar-logo"><p><a style ={{ color: 'white', textDecoration: 'none'}} href="/employee">EMPLOYEE PANEL</a></p></div>
      <nav className="sidebar-nav">
        <NavLink to="/myassets" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <FaLaptop className="icon" />
          <span>My Assets</span>
        </NavLink>

        <NavLink to="/employee/profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <FaUserCircle className="icon" />
          <span>Profile</span>
        </NavLink>

        <button 
          onClick={handleLogout} 
          className="nav-link" 
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <FaSignOutAlt className="icon" />
            <span>Logout</span>

          </button>
      </nav>
    </aside>
  );
};

export default EmployeeSidebar;
