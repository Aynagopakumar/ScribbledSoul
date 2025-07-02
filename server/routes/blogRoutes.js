const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/blogs
// @desc    Create a new blog
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const blog = new Blog({
      ...req.body,
      author: req.user.id, // ✅ use 'user' not 'author'
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

// @route   GET /api/blogs
// @desc    Get all blogs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'username email');
    res.json({ blogs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// @route   GET /api/blogs/:id
// @desc    Get single blog by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'username email');
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

// @route   PUT /api/blogs/:id
// @desc    Update a blog
// @access  Private (only author)
// PUT /api/blogs/:id
// PUT /api/blogs/:id - Update blog (only by author)
router.put('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (String(blog.author) !== String(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized to update this blog" });
    }

    blog.title = req.body.title?.trim() || blog.title;
    blog.content = req.body.content?.trim() || blog.content;

    const updated = await blog.save();
    res.status(200).json(updated);
  } catch (err) {
    console.error('Update Error:', err.message);
    res.status(500).json({ message: err.message || "Server error while updating" });
  }
});


// DELETE /api/blogs/:id
// DELETE /api/blogs/:id - Delete blog (only by author)
router.delete('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this blog" });
    }

    await blog.deleteOne();
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(500).json({ message: "Server error while deleting" });
  }
});



module.exports = router;
