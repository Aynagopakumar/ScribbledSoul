const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  bio: { type: String },
  profilePic: { type: String }, // Base64 string or image URL
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
