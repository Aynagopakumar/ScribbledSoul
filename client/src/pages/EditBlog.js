import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import { toast } from 'react-toastify';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const { quill, quillRef } = useQuill();

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const token = storedUser?.token;

  useEffect(() => {
    if (!quill) return;

    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setTitle(res.data.title);
        quill.clipboard.dangerouslyPasteHTML(res.data.content);
      } catch (err) {
        console.error("Error fetching blog:", err);
        toast.error("Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, quill]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!quill) {
        setLoading(false);
        toast.success("Editor loaded.");
      }
    });

    return () => clearTimeout(timeout);
  }, [quill]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }

    const content = quill?.root?.innerHTML;

    if (!content || content === '<p><br></p>') {
      toast.error("Content is required.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/blogs/${id}`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Blog updated successfully");
      navigate('/dashboard/blogs');
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Loading editor...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Edit Blog</h2>
      <form onSubmit={handleUpdate}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Blog Title"
          className="w-full p-2 border rounded mb-4"
          required
        />
        <div ref={quillRef} className="bg-white h-64 mb-4" />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Blog
        </button>
      </form>
    </div>
  );
};

export default EditBlog;
