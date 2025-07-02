import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const BlogView = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const navigate = useNavigate();

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/blogs/${id}`)
      .then((res) => {
        setBlog(res.data);

        // Safe debug logging
       
      })
      .catch((err) => console.error('Error fetching blog:', err));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      toast.success('Blog deleted successfully');
      navigate('/dashboard/blogs');
    } catch (err) {
      toast.error('Failed to delete blog');
    }
  };

  if (!blog) return <div>Loading...</div>;
  const loggedInId = user ? String(user.id || user._id) : null;
  const authorId = blog?.author?._id ? String(blog.author._id) : null;
  const isAuthor = loggedInId && authorId && loggedInId === authorId;


  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>

      <div className="text-sm text-gray-500 mb-4">
        Posted by{' '}
        <span className="font-medium">
          {blog.author?.username || blog.author?.email || 'Unknown'}
        </span>{' '}
        on {new Date(blog.createdAt).toLocaleDateString()}
      </div>

      {isAuthor && (
        <div className="flex gap-4 mb-4">
          <button
            className="text-sm text-blue-600 hover:underline"
            onClick={() => navigate(`/dashboard/blogs/${blog._id}/edit`)}
          >
            ✏️ Edit
          </button>
          <button
            className="text-sm text-red-600 hover:underline"
            onClick={handleDelete}
          >
            🗑️ Delete
          </button>
        </div>
      )}

      <div className="prose max-w-none">
        <div
          dangerouslySetInnerHTML={{
            __html: blog.content || '<p>[No content]</p>',
          }}
        />
      </div>
    </div>
  );
};

export default BlogView;
