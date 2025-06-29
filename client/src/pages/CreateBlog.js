import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CreateBlog.css';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;
  const { quill, quillRef } = useQuill();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quill) {
      toast.error('Editor not ready. Please wait...');
      return;
    }

    const content = quill.root.innerHTML;

    if (!content || content.trim() === '<p><br></p>') {
      toast.error('Content cannot be empty');
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        'http://localhost:5000/api/blogs',
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Blog created successfully!');
      setTitle('');
      quill.setText('');
      navigate('/blogs');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-blog-container">
      <h2 className="create-blog-title">Create a Blog Post</h2>
      <form onSubmit={handleSubmit} className="create-blog-form">
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="create-blog-input"
        />
        <div className="create-blog-editor">
          <div ref={quillRef} />
        </div>
        <button
          type="submit"
          className="create-blog-button"
          disabled={loading || !quill}
        >
          {loading ? 'Publishing...' : 'Publish'}
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
