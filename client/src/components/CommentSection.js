import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import ReactMarkdown from 'react-markdown';

const CommentSection = ({ blogId }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [replyTo, setReplyTo] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    setComments([]);
    setSkip(0);

    const fetchInitialComments = async () => {
      try {
        const res = await axios.get(`/api/blogs/${blogId}?skip=0&limit=${limit}`);
        const newComments = res.data.blog.comments || [];
        setComments(newComments);
        setTotal(res.data.totalComments || 0);
        setSkip(newComments.length);
      } catch (err) {
        console.error('Error loading comments:', err);
      }
    };

    if (blogId) fetchInitialComments();
  }, [blogId, limit]);

  const handleLoadMore = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/blogs/${blogId}?skip=${skip}&limit=${limit}`);
      const more = res.data.blog.comments || [];
      setComments((prev) => [...prev, ...more]);
      setSkip(skip + more.length);
    } catch (err) {
      console.error('Error loading more comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const endpoint = replyTo ? `/api/blogs/comment/reply/${replyTo}` : `/api/blogs/comment/${blogId}`;
      const res = await axios.post(endpoint, { text: comment }, config);
      const updatedComments = res.data.comments || res.data.blog?.comments || [];
      setComments(updatedComments);
      setTotal(updatedComments.length);
      setComment('');
      setReplyTo(null);
      setSkip(updatedComments.length);
    } catch (err) {
      console.error('Error posting comment/reply:', err);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`/api/blogs/comment/${commentId}`, config);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const handleLike = async (commentId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.post(`/api/blogs/comment/like/${commentId}`, {}, config);
      const updated = res.data.updatedComment;
      setComments((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c))
      );
    } catch (err) {
      console.error('Error liking comment:', err);
    }
  };

  const addEmoji = (e) => {
    setComment((prev) => prev + e.native);
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-4 relative">
        <input
          type="text"
          placeholder={replyTo ? 'Reply to comment...' : 'Add a comment...'}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="flex-grow border px-3 py-1 rounded"
        />
        <button type="button" onClick={() => setShowPicker((prev) => !prev)}>😊</button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          {replyTo ? 'Reply' : 'Post'}
        </button>
        {showPicker && (
          <div className="absolute bottom-12 left-0 z-10">
            <Picker data={data} onEmojiSelect={addEmoji} theme="light" />
          </div>
        )}
      </form>

      <div className="space-y-3">
        {comments.length === 0 && <p className="text-gray-400 text-sm">No comments yet.</p>}
        {comments.map((c, i) => (
          <div key={i} className="bg-gray-100 p-3 rounded shadow-sm">
            <div className="text-sm text-gray-800">
              <span className="font-semibold">{c.user?.username || c.user?.email}</span>:
              <ReactMarkdown className="inline ml-1">{c.text}</ReactMarkdown>
            </div>
            <div className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</div>
            <div className="flex gap-3 text-xs mt-1 text-blue-600">
              <button onClick={() => handleLike(c._id)}>❤️ {c.likes?.length || 0}</button>
              <button onClick={() => setReplyTo(c._id)}>💬 Reply</button>
              {user?.user?._id === c.user?._id && (
                <button onClick={() => handleDelete(c._id)} className="text-red-600">🗑️ Delete</button>
              )}
            </div>
            {c.replies?.length > 0 && (
              <div className="mt-2 ml-4 space-y-2">
                {c.replies.map((r, j) => (
                  <div key={j} className="text-sm text-gray-700 border-l-2 pl-2">
                    <strong>{r.user?.username || r.user?.email}</strong>: {r.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {comments.length < total && (
        <div className="text-center mt-4">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="text-blue-600 hover:underline text-sm"
          >
            {loading ? 'Loading...' : 'Load More Comments'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
