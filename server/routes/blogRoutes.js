const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/blogs
router.post('/', protect, async (req, res) => {
  try {
    const blog = new Blog({
      ...req.body,
      author: req.user.id,
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

// @route   GET /api/blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'username email')
        .populate('likes', 'username email')
      .populate('comments.user', 'username email');

    res.json({ blogs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// @route   GET /api/blogs/:id (with comment pagination)
router.get('/:id', async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 5;

    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username email')
       .populate('likes', 'username email')
      .lean();

    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    const totalComments = blog.comments.length;
    const slicedComments = blog.comments
      .slice(skip, skip + limit)
      .map((comment) => ({
        ...comment,
        user: comment.user,
      }));

    const populatedComments = await Promise.all(
      slicedComments.map(async (c) => {
        const user = await User.findById(c.user).select('username email');
        return { ...c, user };
      })
    );

    blog.comments = populatedComments;

    res.json({ blog, totalComments });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blog with comments' });
  }
});

// @route   PUT /api/blogs/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    if (String(blog.author) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized to update this blog' });
    }

    blog.title = req.body.title?.trim() || blog.title;
    blog.content = req.body.content?.trim() || blog.content;

    const updated = await blog.save();
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error while updating' });
  }
});

// @route   DELETE /api/blogs/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    if (String(blog.author) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized to delete this blog' });
    }

    await blog.deleteOne();
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error while deleting' });
  }
});

// @route   PUT /api/blogs/like/:id
router.put('/like/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    const userId = req.user._id;

    const alreadyLiked = blog.likes.includes(userId);
    if (alreadyLiked) {
      blog.likes.pull(userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling like', error });
  }
});

// @route   POST /api/blogs/comment/:id
router.post('/comment/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    const comment = {
      user: req.user._id,
      text: req.body.text,
      createdAt: new Date(),
    };

    blog.comments.push(comment);
    await blog.save();

    const updatedBlog = await Blog.findById(blog._id)
      .populate('author', 'username email')
      .populate('comments.user', 'username email');

    res.status(200).json(updatedBlog);
  } catch (err) {
    res.status(500).json({ message: 'Error adding comment', err });
  }
});

// @route   PUT /api/blogs/comment/:blogId/:commentId
router.put('/comment/:blogId/:commentId', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    const comment = blog.comments.id(req.params.commentId);

    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (String(comment.user) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized to edit this comment' });
    }

    comment.text = req.body.text;
    await blog.save();

    const updated = await Blog.findById(req.params.blogId).populate('comments.user', 'username email');
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error editing comment', err });
  }
});

// @route   DELETE /api/blogs/comment/:blogId/:commentId
router.delete('/comment/:blogId/:commentId', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    const comment = blog.comments.id(req.params.commentId);

    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (String(comment.user) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized to delete this comment' });
    }

    comment.remove();
    await blog.save();

    const updated = await Blog.findById(req.params.blogId).populate('comments.user', 'username email');
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting comment', err });
  }
});

module.exports = router;
