const multer = require('multer');
const path = require('path');

// Store in "uploads/" folder locally
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // e.g., 172364.png
  },
});

const upload = multer({ storage });
module.exports = upload;
