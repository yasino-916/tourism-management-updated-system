import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { visitorService } from '../../../services/visitorService';
import ThemeToggle from '../../common/ThemeToggle';

function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthdate: '',
    address: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Map form data to user object structure
    const userData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone_number: formData.phone, // Changed to phone_number
      password: formData.password,
      // username: formData.email // Backend likely uses email
    };

    try {
      await visitorService.register(userData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Registration failed. Please try again.');
    }
  };


  return (
    <div className="register-container" style={{ position: 'relative' }}>
      {/* Theme Toggle inside the box */}
      <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 10 }}>
        <ThemeToggle />
      </div>

      <div className="register-box">
        <h2 style={{
          textAlign: 'center',
          marginBottom: '10px',
          fontSize: '24px',
          color: 'var(--text-primary)'
        }}>
          Create Account
        </h2>
        <p style={{
          textAlign: 'center',
          color: 'var(--text-secondary)',
          marginBottom: '25px',
          fontSize: '14px'
        }}>
          Join our community of explorers
        </p>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Register</button>
        </form>

        <div className="login-link">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '20px',
          fontSize: '0.9rem'
        }}>
          <Link
            to="/"
            style={{
              color: '#6b7280',
              textDecoration: 'none',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = '#3b82f6'}
            onMouseLeave={(e) => e.target.style.color = '#6b7280'}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
