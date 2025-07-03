import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import ReactMarkdown from 'react-markdown';

const CommentModal = ({ blogId, isOpen, onClose }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!isOpen) return;

    const fetchInitialComments = async () => {
      try {
        const res = await axios.get(`/api/blogs/${blogId}?skip=0&limit=${limit}`);
        setComments(res.data.blog.comments || []);
        setTotal(res.data.totalComments || 0);
        setSkip(res.data.blog.comments.length);
      } catch (err) {
        console.error('Error loading comments:', err);
      }
    };

    fetchInitialComments();
  }, [blogId, isOpen, limit]);

  const handleLoadMore = async () => {
    try {
      const res = await axios.get(`/api/blogs/${blogId}?skip=${skip}&limit=${limit}`);
      const more = res.data.blog.comments || [];
      setComments((prev) => [...prev, ...more]);
      setSkip(skip + more.length);
    } catch (err) {
      console.error('Error loading more:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.post(`/api/blogs/comment/${blogId}`, { text: comment }, config);
      const updatedComments = res.data.comments || res.data.blog?.comments || [];
      setComments(updatedComments);
      setTotal(updatedComments.length);
      setComment('');
      setSkip(updatedComments.length);
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  const addEmoji = (e) => {
    setComment((prev) => prev + e.native);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white max-w-lg w-full rounded-lg p-4 relative max-h-[90vh] overflow-y-auto shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl"
        >
          ✖
        </button>
        <h3 className="text-lg font-semibold mb-3">💬 Comments</h3>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-4 relative">
          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-grow border px-3 py-1 rounded"
          />
          <button type="button" onClick={() => setShowPicker((prev) => !prev)}>😊</button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Post
          </button>
          {showPicker && (
            <div className="absolute bottom-12 left-0 z-10">
              <Picker data={data} onEmojiSelect={addEmoji} theme="light" />
            </div>
          )}
        </form>

        <div className="space-y-3">
          {comments.map((c, i) => (
            <div key={i} className="bg-gray-100 p-2 rounded">
              <p className="text-sm">
                <span className="font-semibold">{c.user?.username || c.user?.email}</span>:{' '}
                <ReactMarkdown>{c.text}</ReactMarkdown>
              </p>
              <p className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>

        {comments.length < total && (
          <div className="text-center mt-4">
            <button
              onClick={handleLoadMore}
              className="text-blue-600 hover:underline text-sm"
            >
              Load More Comments
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentModal;
