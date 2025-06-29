import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const BlogView = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user')); // Get logged-in user

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/blogs/${id}`)
      .then((res) => {
        console.log('Fetched blog:', res.data.blog);
        setBlog(res.data.blog);
      })
      .catch((err) => console.log(err));
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
      navigate('/blogs');
    } catch (err) {
      toast.error('Failed to delete blog');
    }
  };

  if (!blog) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>

      <div className="text-sm text-gray-500 mb-4">
        Posted by{' '}
        <span className="font-medium">
          {blog.author?.username || blog.author?.email}
        </span>{' '}
        on {new Date(blog.createdAt).toLocaleDateString()}
      </div>

      {/* Edit/Delete Buttons (only if author) */}
      {blog.author?._id === user?.id && (
        <div className="flex gap-4 mb-4">
          <button
            className="text-sm text-blue-600 hover:underline"
            onClick={() => navigate(`/edit/${blog._id}`)}
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
