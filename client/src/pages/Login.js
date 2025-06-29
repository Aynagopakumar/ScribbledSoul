import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      toast.success('Social login successful!');
      navigate('/profile');
    }
  }, [location, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      const user = res.data.user;
      const token = res.data.token;

      // ✅ Save full user info
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: user._id,
          email: user.email,
          username: user.username,
          token: token,
        })
      );

      toast.success('Login successful');
      navigate('/blogs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login to Your Account</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="primary-button">
            Login
          </button>
        </form>

        <div className="divider">or</div>
        <div className="oauth-buttons">
          <button
            className="google-btn"
            onClick={() =>
              (window.location.href =
                'http://localhost:5000/api/auth/google')
            }
          >
            <img
              src="https://img.icons8.com/color/16/000000/google-logo.png"
              alt="Google"
            />
            Login with Google
          </button>
          <button
            className="facebook-btn"
            onClick={() =>
              (window.location.href =
                'http://localhost:5000/api/auth/facebook')
            }
          >
            <img
              src="https://img.icons8.com/ios-filled/16/ffffff/facebook-new.png"
              alt="Facebook"
            />
            Login with Facebook
          </button>
        </div>

        <div className="footer-links">
          Don’t have an account? <a href="/register">Register</a>
        </div>
      </div>
    </div>
  );
};

export default Login;


