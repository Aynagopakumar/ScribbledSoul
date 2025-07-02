import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './profile.css';
import { toast } from 'react-toastify'; // Optional

const Profile = () => {
  const [form, setForm] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    profilePic: ''
  });

  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = storedUser?.token;

  // Fetch user profile on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setForm(res.data.user);
      } catch (err) {
        console.error(err);
        setMessage('Error loading profile');
        toast.error('Error loading profile'); // Optional
      }
    };

    if (token) fetchProfile();
  }, [token]);

  // Handle form field updates
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle image file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit profile update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { username, _id, ...safeForm } = form; // Don't send sensitive fields
      const res = await axios.put('http://localhost:5000/api/auth/profile', safeForm, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage(res.data.message || 'Profile updated');
      toast.success('Profile updated'); // Optional
      setIsEditing(false);
    } catch (err) {
      console.error('Update Error:', err.response?.data || err.message);
      setMessage(err.response?.data?.message || 'Error updating profile');
      toast.error(err.response?.data?.message || 'Update failed'); // Optional
    }
  };

  return (
    <div className="profile-container">
      {!isEditing ? (
        <div className="profile-preview">
          <h2>Your Profile</h2>
          {message && <p className="profile-message">{message}</p>}
          <img
            src={form.profilePic || "https://i.pravatar.cc/150?img=3"}
            alt="Profile"
            className="profile-avatar"
          />
          <p><strong>Username:</strong> {form.username}</p>
          <p><strong>Name:</strong> {form.name}</p>
          <p><strong>Email:</strong> {form.email}</p>
          <p><strong>Phone:</strong> {form.phone}</p>
          <p><strong>Address:</strong> {form.address}</p>
          <p><strong>Bio:</strong> {form.bio}</p>
          <button onClick={() => setIsEditing(true)} className="profile-button">Edit Profile</button>
        </div>
      ) : (
        <div className="profile-card">
          <h2>Edit Profile</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={form.name || ''}
              onChange={handleChange}
              placeholder="Full Name"
              className="profile-input"
              autoComplete="name"
            />
            <input
              type="email"
              name="email"
              value={form.email || ''}
              onChange={handleChange}
              placeholder="Email"
              className="profile-input"
              autoComplete="email"
            />
            <input
              type="text"
              name="phone"
              value={form.phone || ''}
              onChange={handleChange}
              placeholder="Phone"
              className="profile-input"
              autoComplete="tel"
            />
            <input
              type="text"
              name="address"
              value={form.address || ''}
              onChange={handleChange}
              placeholder="Address"
              className="profile-input"
              autoComplete="street-address"
            />
            <textarea
              name="bio"
              value={form.bio || ''}
              onChange={handleChange}
              placeholder="Bio"
              className="profile-input"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="profile-input"
            />

            <div className="form-buttons">
              <button type="submit" className="profile-button">Save</button>
              <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;
