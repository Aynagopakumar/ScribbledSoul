import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const SingleBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        toast.error('Failed to load blog');
      }
    };
    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      toast.success('Blog deleted');
      navigate('/blogs');
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.info('Link copied!');
  };

  if (!blog) return <p>Loading...</p>;

  const isAuthor = user?.id === blog?.author?._id;

  return (
    <div className="p-6 max-w-4xl mx-auto flex flex-col gap-6">
      <h1 className="text-3xl font-bold">{blog.title}</h1>
      <p className="text-sm text-gray-500">
        Posted by {blog.author?.username || 'Unknown'} on{' '}
        {new Date(blog.createdAt).toLocaleDateString()}
      </p>

      <div
        className="text-gray-800 text-lg"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      <div className="flex gap-4 mt-6">
        {isAuthor && (
          <Link
            to={`/blogs/edit/${blog._id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ✏️ Edit
          </Link>
        )}
        {isAuthor && (
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            🗑️ Delete
          </button>
        )}
        <button
          onClick={handleShare}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          📤 Share
        </button>
        <button
          onClick={() => toast.info('Like feature coming soon!')}
          className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
        >
          ❤️ Like
        </button>
        <button
          onClick={() => toast.info('Comments coming next!')}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          💬 Comment
        </button>
      </div>
    </div>
  );
};

export default SingleBlog;
