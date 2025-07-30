import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/admin/Dashboard';
import SignupPage from './pages/SignupPage';
import UsersPage from './pages/UsersPage';
import AssetsPage from './pages/AssetsPage';
import EmployeeDashboard from './pages/EmployeeDashboard';
import MyAssets from './pages/MyAssets';
import PrivateRoute from './components/PrivateRoute';
import AssignmentHistory from './pages/AssignmentHistory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        
        {/* Protected routes */}
        <Route
  path="/admin"
  element={
    <PrivateRoute allowedRoles={['Admin']}>
      <Dashboard />
    </PrivateRoute>
  }
/>
        <Route path="/users" element={<PrivateRoute><UsersPage /></PrivateRoute>} />
        <Route path="/assets" element={<PrivateRoute><AssetsPage /></PrivateRoute>} />
        <Route path="/assignments" element={<PrivateRoute><AssignmentHistory /></PrivateRoute>} />
        
        <Route
  path="/employee"
  element={
    <PrivateRoute allowedRoles={['Employee', 'Admin']}>
      <EmployeeDashboard />
    </PrivateRoute>
  }
/>
        <Route path="/myassets" element={<PrivateRoute><MyAssets /></PrivateRoute>} />
        
      </Routes>
    </Router>
  );
}

export default App;
