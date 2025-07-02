import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Blog from '../components/Blog';
import { useNavigate } from 'react-router-dom';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/blogs');
        setBlogs(res.data.blogs || []);
      } catch (err) {
        console.error('Error fetching blogs:', err);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* What's on your mind box */}
      <div
        onClick={() => navigate('/dashboard/create')}
        className="mb-6 border-2 border-gray-300 rounded-lg p-4 bg-white shadow cursor-pointer hover:bg-gray-50"
      >
        <p className="text-gray-600">📝 What's on your mind?</p>
      </div>

      <h2 className="text-2xl font-bold mb-4">All Blog Posts</h2>
      {blogs.length > 0 ? (
  blogs.map((blog) => (
    <Blog
      key={blog._id}
      blog={blog}
      onDelete={(deletedId) =>
        setBlogs((prev) => prev.filter((b) => b._id !== deletedId))
      }
    />
  ))
) : (
  <p>No blogs found.</p>
)}
</div>
  );
};

export default BlogList;
