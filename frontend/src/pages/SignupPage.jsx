import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import '../styles/LoginPage.css'; // Reuse the login styling!
import axios from 'axios';

function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPass) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPass) {
      setError('Passwords do not match.');
      return;
    }

    // Simulated account creation
    try {
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name,
      email,
      password,
    });

    console.log(response.data);

    alert('Account created! Please login.');

    navigate('/'); // Redirect to login page

  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || 'Signup failed! Please try again.');
  }

}


  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="title">Create an Account</h2>
        <p className="subtitle">Start managing your assets</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <FiUser className="icon" />
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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

          <div className="input-group">
            <FiLock className="icon" />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">Sign Up</button>

          <div className="footer-links">
            <Link to="/">Already have an account?</Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SignUpPage;
