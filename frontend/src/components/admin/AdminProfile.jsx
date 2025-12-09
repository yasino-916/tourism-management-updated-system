import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import './admin.css';
import { changePassword, updateProfile } from './adminService';
import ThemeToggle from '../common/ThemeToggle';

export default function AdminProfile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: ''
  });
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const storedUser = localStorage.getItem('admin_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        setProfileData({
          firstName: parsedUser.first_name || '',
          lastName: parsedUser.last_name || '',
          email: parsedUser.email || '',
          username: parsedUser.user_type || 'admin' // user_type is used as username conceptually here
        });
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const submitProfile = async (e) => {
    e.preventDefault();
    setProfileMessage({ type: '', text: '' });
    try {
      const res = await updateProfile(user.email, {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        email: profileData.email
      });

      const updatedUser = {
        ...user,
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        email: profileData.email
      };
      localStorage.setItem('admin_user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      setProfileMessage({ type: 'success', text: 'Profile updated successfully' });
      setIsEditing(false);
    } catch (err) {
      setProfileMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    try {
      await changePassword(user.username, passwordData.currentPassword, passwordData.newPassword);
      setPasswordMessage({ type: 'success', text: 'Password changed successfully' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsChangingPassword(false);
    } catch (err) {
      setPasswordMessage({ type: 'error', text: err.message || 'Failed to change password' });
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 20px' }}>
          <ThemeToggle />
        </div>
        <div className="admin-profile-card-new">
          {/* Header */}
          <div className="profile-header-row">
            <h2>Edit Profile Information</h2>
            {!isEditing && (
              <button className="btn-blue" onClick={() => setIsEditing(true)}>Edit Profile</button>
            )}
          </div>

          {/* User Info */}
          <div className="profile-user-info">
            <div className="avatar-circle-large">
              {profileData.firstName.charAt(0).toLowerCase()}
            </div>
            <div className="user-details">
              <h3>{profileData.firstName} {profileData.lastName}</h3>
              <p>{profileData.username}</p>
            </div>
          </div>

          {/* Profile Form/View */}
          {isEditing ? (
            <form onSubmit={submitProfile} className="profile-edit-form">
              {profileMessage.text && <div className={`alert alert-${profileMessage.type}`}>{profileMessage.text}</div>}
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Username</label>
                  <input
                    type="text"
                    name="username"
                    value={profileData.username}
                    onChange={handleProfileChange}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
                <button type="submit" className="btn-blue">Save Changes</button>
              </div>
            </form>
          ) : (
            <div className="profile-view-grid">
              <div className="view-group">
                <label>First Name:</label>
                <div className="view-value">{profileData.firstName}</div>
              </div>
              <div className="view-group">
                <label>Last Name:</label>
                <div className="view-value">{profileData.lastName}</div>
              </div>
              <div className="view-group full-width">
                <label>Username:</label>
                <div className="view-value">{profileData.username}</div>
              </div>
            </div>
          )}

          <div className="profile-divider"></div>

          {/* Security Section */}
          <div className="profile-header-row">
            <h2>Security</h2>
            {!isChangingPassword && (
              <button className="btn-orange" onClick={() => setIsChangingPassword(true)}>Change Password</button>
            )}
          </div>

          {isChangingPassword && (
            <form onSubmit={submitPassword} className="password-form">
              {passwordMessage.text && <div className={`alert alert-${passwordMessage.type}`}>{passwordMessage.text}</div>}
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="form-control"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-outline" onClick={() => setIsChangingPassword(false)}>Cancel</button>
                <button type="submit" className="btn-orange">Update Password</button>
              </div>
            </form>
          )}

        </div>
      </main>
    </div>
  );
}
