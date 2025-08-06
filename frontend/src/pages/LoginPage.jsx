import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import '../styles/LoginPage.css';
import axios from 'axios';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  try {
const response = await axios.post('http://localhost:5000/api/auth/login', {
  email,
  password,
});


    const { token, user } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    if(user.role === 'Admin'){
      navigate('/admin');
    }else{
      navigate('/employee');
    }
    

  } catch (err) {
    console.error(err); // for debugging
    setError(err.response?.data?.message || 'Login failed! Please try again.');
  }
};

  return (
    <div className="login-page">
      <div className="login-card">
        <img src="C:\Users\NSHUTI\Desktop\assets-app\frontend\public\prime3.png" alt="" />
        <h2 className="title">Sign in to your account</h2>
        <p className="subtitle">Manage your assets efficiently</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <FiMail className="icon" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FiLock className="icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">Login</button>

          <div className="footer-links">
            <Link to="/forgot-password">Forgot password?</Link>
            <span>•</span>
            <Link to="/register">Create account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
