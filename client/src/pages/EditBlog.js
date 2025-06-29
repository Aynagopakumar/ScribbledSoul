import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import { toast } from 'react-toastify';

const EditBlog = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const { quill, quillRef } = useQuill();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Fetch blog data on mount
  useEffect(() => {
    if (!quill) return;

    axios.get(`http://localhost:5000/api/blogs/${id}`)
      .then((res) => {
        const blog = res.data.blog;
        setTitle(blog.title);
        if (quill) {
          quill.root.innerHTML = blog.content;
        }
      })
      .catch(() => toast.error("Failed to load blog"));
  }, [id, quill]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = quill.root.innerHTML;

    if (!title.trim() || !content || content === '<p><br></p>') {
      toast.error('Please fill out the title and content.');
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/blogs/${id}`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success("Blog updated successfully!");
      navigate(`/blogs/${id}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update blog.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">✏️ Edit Blog</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded mb-4"
          required
        />
        <div ref={quillRef} className="mb-4 h-64 bg-white border border-gray-300 rounded" />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Update Blog
        </button>
      </form>
    </div>
  );
};

export default EditBlog;
