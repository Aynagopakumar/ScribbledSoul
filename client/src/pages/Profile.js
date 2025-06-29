import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './profile.css';

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
  const [isEditing, setIsEditing] = useState(false); // ✅ Toggle form
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setForm(res.data.user);
      } catch (err) {
        console.error(err);
        setMessage('Error loading profile');
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('http://localhost:5000/api/auth/profile', form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage(res.data.message);
      setIsEditing(false); // ✅ Go back to preview
    } catch (err) {
      console.error(err);
      setMessage('Error updating profile');
    }
  };
  const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, profilePic: reader.result }); // base64 image preview
    };
    reader.readAsDataURL(file);
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
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              className="profile-input"
              autoComplete="username"
              disabled
            />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="profile-input"
              autoComplete="name"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="profile-input"
              autoComplete="email"
              disabled
            />
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="profile-input"
              autoComplete="tel"
            />
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
              className="profile-input"
              autoComplete="street-address"
            />
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Bio"
              className="profile-input"
            ></textarea>
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
