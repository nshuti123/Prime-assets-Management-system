import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaLaptop, FaUserCircle, FaSignOutAlt, FaWindowClose, FaWindowMaximize } from 'react-icons/fa';

const EmployeeSidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {isOpen && (
        <aside className="bg-gray-50 text-black p-4 w-60  transform scale-90">
          <div className="text-lg font-semibold mb-6">
            <NavLink to="/employee" className="text-black no-underline">
              EMPLOYEE PANEL
            </NavLink>
          </div>

          <nav className="space-y-1 text-sm">
            <NavLink
              to="/myassets"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-200 ${
                  isActive ? 'bg-gray-300' : ''
                }`
              }
            >
              <FaLaptop />
              <span>My Assets</span>
            </NavLink>

            <NavLink
              to="/employee/profile"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-200 ${
                  isActive ? 'bg-gray-300' : ''
                }`
              }
            >
              <FaUserCircle />
              <span>Profile</span>
            </NavLink>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-red-100 w-full text-left text-red-600"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </nav>
        </aside>
      )}

      {/* Toggle Button */}
      <div
        className="flex items-start bg-gray-50 text-black px-2 py-5"
        style={{ boxShadow: '4px 0 6px -1px rgba(0, 0, 0, 0.1)' }}
      >
        <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
          {isOpen ? <FaWindowClose size={20} /> : <FaWindowMaximize size={20} />}
        </button>
      </div>
    </div>
  );
};

export default EmployeeSidebar;
