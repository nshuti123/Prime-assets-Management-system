import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaBoxes, FaUserAlt, FaCog, FaSignOutAlt, FaHistory, FaWindowMaximize, FaWindowClose,
} from 'react-icons/fa';

const Sidebar = ({ onToggle }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    if (onToggle) onToggle(!isOpen); // let parent component know
  };

  useEffect(() => {
    if (onToggle) onToggle(isOpen);
  }, [isOpen, onToggle]);

  return (
    <div className="fixed top-0 left-0 h-screen flex items-start">
      {/* Sidebar */}
      {isOpen && (
        <aside className="bg-gray-50 text-black h-full p-4 overflow-y-auto transition-all duration-300  transform scale-90">
          <div className="text-lg font-semibold mb-6">
            <NavLink to="/admin" className="text-black no-underline">
              ADMIN PANEL
            </NavLink>
          </div>

          <nav className="space-y-1 text-sm">
            <NavLink
              to="/assets"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-200 ${
                  isActive ? 'bg-gray-300' : ''
                }`
              }
            >
              <FaBoxes />
              <span>Assets</span>
            </NavLink>

            <NavLink
              to="/users"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-200 ${
                  isActive ? 'bg-gray-300' : ''
                }`
              }
            >
              <FaUserAlt />
              <span>Users</span>
            </NavLink>

            <NavLink
              to="/assignments"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-200 ${
                  isActive ? 'bg-gray-300' : ''
                }`
              }
            >
              <FaHistory />
              <span>Assignment History</span>
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-200 ${
                  isActive ? 'bg-gray-300' : ''
                }`
              }
            >
              <FaCog />
              <span>Settings</span>
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
      <div className="flex-1 h-screen bg-gray-50 p-4" style={{ boxShadow: '4px 0 6px -1px rgba(2, 0, 0, 0.1)' }}>
        <button onClick={toggleSidebar} className="focus:outline-none">
          {isOpen ? <FaWindowClose size={20} /> : <FaWindowMaximize size={20} />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
