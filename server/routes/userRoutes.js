const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadProfilePic');

// POST /api/users/upload-profile-pic
router.post('/upload-profile-pic', upload.single('profilePic'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const imagePath = `/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl: imagePath });
});

module.exports = router;
