import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../../services/authService';
import ThemeToggle from '../../common/ThemeToggle';
import { useLanguage } from '../../../context/LanguageContext';

function LoginForm() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    setError('');

    try {
      const user = await authService.login(email, password);

      if (user) {
        if (user.is_active === false || user.is_active === 0) {
          alert('Your account has been deactivated. Please contact the administrator.');
          return;
        }

        const userType = user.user_type ? user.user_type.toLowerCase().trim() : 'visitor';

        const token = localStorage.getItem('token');
        const setLocalData = () => {
          if (userType === 'admin') {
            localStorage.setItem('admin_token', token);
            localStorage.setItem('admin_user', JSON.stringify(user));
            navigate('/admin/dashboard');
          } else if (userType === 'researcher') {
            localStorage.setItem('researcher_token', token);
            localStorage.setItem('researcher_user', JSON.stringify(user));
            navigate('/researcher/dashboard');
          } else if (userType === 'guide' || userType === 'site_agent') {
            localStorage.setItem('guide_token', token);
            localStorage.setItem('guide_user', JSON.stringify(user));
            navigate('/guide/dashboard');
          } else {
            localStorage.setItem('visitor_token', token);
            localStorage.setItem('visitor_user', JSON.stringify(user));
            navigate('/visitor/dashboard');
          }
        };

        if (user.password_changed === 0 || !user.password_changed) {
          if (window.confirm("Login successful! This is your first login. Would you like to change your password for security?")) {
            setIsLoginSuccess(true);
            localStorage.setItem('temp_user', JSON.stringify(user));
            localStorage.setItem('temp_user_type', userType);
          } else {
            setLocalData();
          }
        } else {
          setLocalData();
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Invalid credentials. Please check your email and password.');
    }
  };

  if (isLoginSuccess) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Change Password</h2>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const newPass = e.target.new_password.value;
            const confirmPass = e.target.confirm_password.value;

            const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
            if (!strongRegex.test(newPass)) {
              alert("Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.");
              return;
            }

            if (newPass !== confirmPass) {
              alert("Passwords do not match.");
              return;
            }

            try {

              await authService.changePassword(newPass);
              alert("Password changed successfully!");

              const userType = localStorage.getItem('temp_user_type');
              const user = JSON.parse(localStorage.getItem('temp_user'));
              const token = localStorage.getItem('token');

              if (userType === 'admin') {
                localStorage.setItem('admin_token', token);
                localStorage.setItem('admin_user', JSON.stringify(user));
                navigate('/admin/dashboard');
              } else if (userType === 'researcher') {
                localStorage.setItem('researcher_token', token);
                localStorage.setItem('researcher_user', JSON.stringify(user));
                navigate('/researcher/dashboard');
              } else if (userType === 'guide' || userType === 'site_agent') {
                localStorage.setItem('guide_token', token);
                localStorage.setItem('guide_user', JSON.stringify(user));
                navigate('/guide/dashboard');
              } else {
                localStorage.setItem('visitor_token', token);
                localStorage.setItem('visitor_user', JSON.stringify(user));
                navigate('/visitor/dashboard');
              }
              localStorage.removeItem('temp_user');
              localStorage.removeItem('temp_user_type');

            } catch (err) {
              alert("Failed to change password: " + err.message);
            }
          }}>
            <div className="form-group">
              <input type="password" name="new_password" placeholder="New Password" required />
            </div>
            <div className="form-group">
              <input type="password" name="confirm_password" placeholder="Confirm New Password" required />
            </div>
            <button type="submit">Update & Continue</button>
            <button type="button" className="btn-ghost" onClick={() => {
              const userType = localStorage.getItem('temp_user_type');
              const user = JSON.parse(localStorage.getItem('temp_user'));
              const token = localStorage.getItem('token');

              if (userType === 'admin') {
                localStorage.setItem('admin_token', token);
                localStorage.setItem('admin_user', JSON.stringify(user));
                navigate('/admin/dashboard');
              } else if (userType === 'researcher') {
                localStorage.setItem('researcher_token', token);
                localStorage.setItem('researcher_user', JSON.stringify(user));
                navigate('/researcher/dashboard');
              } else if (userType === 'guide' || userType === 'site_agent') {
                localStorage.setItem('guide_token', token);
                localStorage.setItem('guide_user', JSON.stringify(user));
                navigate('/guide/dashboard');
              } else {
                localStorage.setItem('visitor_token', token);
                localStorage.setItem('visitor_user', JSON.stringify(user));
                navigate('/visitor/dashboard');
              }
              localStorage.removeItem('temp_user');
              localStorage.removeItem('temp_user_type');
            }}>Skip for now</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container" style={{ position: 'relative' }}>
      {}
      <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 10 }}>
        <ThemeToggle />
      </div>

      <div className="login-box">
        <h2 style={{
          textAlign: 'center',
          marginBottom: '10px',
          fontSize: '24px',
          color: 'var(--text-primary)'
        }}>
          {t('login_title')}
        </h2>
        <p style={{
          textAlign: 'center',
          color: 'var(--text-secondary)',
          marginBottom: '25px',
          fontSize: '14px'
        }}>
          {t('login_subtitle')}
        </p>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder={t('login_email_ph')}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <div className="password-wrapper" style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={t('login_password_ph')}
                value={formData.password}
                onChange={handleChange}
                required
                id="password"
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.2rem'
                }}
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>
          </div>

          <button type="submit">{t('login_btn')}</button>
        </form>

        <div className="forgot-password">
          <Link to="/forgot">{t('login_forgot')}</Link>
        </div>

        <div className="register-link">
          <p>{t('login_register_text')} <Link to="/register">{t('login_register_link')}</Link></p>
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
            {t('back_home')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
