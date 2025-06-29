
// blogRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const Blog = require('../models/Blog');

router.post('/', verifyToken, async (req, res) => {
  try {
    const blog = new Blog({ ...req.body, author: req.user.id });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'username email');
    res.json({ blogs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'username email');
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json({ blog });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    if (blog.author.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
    Object.assign(blog, req.body);
    await blog.save();
    res.json({ message: 'Blog updated successfully', blog });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    if (blog.author.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
    await blog.deleteOne();
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

module.exports = router;