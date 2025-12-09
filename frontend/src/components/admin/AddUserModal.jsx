import React, { useState } from 'react';
import AdminModal from './AdminModal';
import './admin.css';
import { createUser } from './adminService';

export default function AddUserModal({ onClose, onCreated, defaultType = 'site_agent' }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userType, setUserType] = useState(defaultType);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newUser = await createUser({ 
        first_name: firstName, 
        last_name: lastName, 
        email, 
        phone_number: phoneNumber,
        user_type: userType 
      });
      onCreated && onCreated(newUser);
      onClose();
    } catch (err) {
      alert('Failed to create user: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminModal title={`Add ${userType}`} onClose={onClose}>
      <form onSubmit={submit}>
        <label>First name</label>
        <input value={firstName} onChange={e => setFirstName(e.target.value)} required />
        <label>Last name</label>
        <input value={lastName} onChange={e => setLastName(e.target.value)} required />
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label>Phone Number</label>
        <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
        <label>Type</label>
        <select value={userType} onChange={e => setUserType(e.target.value)}>
          <option value="site_agent">Site Agent</option>
          <option value="researcher">Researcher</option>
        </select>
        <div style={{marginTop:12}}>
          <button className="btn-primary" disabled={submitting}>{submitting ? 'Adding…' : 'Add'}</button>
          <button type="button" className="btn-outline" onClick={onClose} style={{marginLeft:8}}>Cancel</button>
        </div>
      </form>
    </AdminModal>
  );
}
