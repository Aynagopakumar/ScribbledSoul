import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import LikeButton from './LikeButton';
import CommentModal from './CommentModal';
import LikeModal from './LikeModal';

const Blog = ({ blog, onDelete }) => {
  const [showComments, setShowComments] = useState(false);
  const [showLikes, setShowLikes] = useState(false);

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();

  const navigate = useNavigate();
  const loggedInUserId = String(user?.id || user?._id);
  const isAuthor = blog?.author && String(blog.author._id) === loggedInUserId;

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this blog?");
    if (!confirm) return;

    try {
      await axios.delete(`/api/blogs/${blog._id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      toast.success("Blog deleted successfully");
      onDelete(blog._id);
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="border rounded shadow-md p-4 mb-6 bg-white hover:shadow-lg transition-all">
      {/* Blog Title */}
      <Link to={`/dashboard/blogs/${blog._id}`}>
        <h3 className="text-xl font-semibold mb-2 text-blue-700 hover:underline">
          {blog.title}
        </h3>
      </Link>

      {/* Blog Content Preview */}
      <p className="text-gray-600 text-sm">
        {blog.content.replace(/<[^>]+>/g, '').substring(0, 150)}...
      </p>

      {/* Author and Date */}
      <div className="text-xs text-gray-500 mt-2">
        Posted by <span className="font-medium">{blog?.author?.username || blog?.author?.email || 'Unknown'}</span> on{' '}
        {new Date(blog.createdAt).toLocaleDateString()}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
        <LikeButton blogId={blog._id} initialLikes={blog.likes} />
        <button onClick={() => setShowLikes(true)} className="text-gray-600 hover:underline">
          ❤️ View Likes ({blog.likes.length})
        </button>
        <button onClick={() => setShowComments(true)} className="text-blue-600 hover:underline">
          💬 View Comments ({blog.comments.length})
        </button>
      </div>

      {/* Author Actions */}
      {isAuthor && (
        <div className="mt-4 flex gap-4">
          <button
            onClick={() => navigate(`/dashboard/blogs/${blog._id}/edit`)}
            className="text-blue-600 hover:underline text-sm"
          >
            ✏️ Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:underline text-sm"
          >
            🗑️ Delete
          </button>
        </div>
      )}

      {/* Modals */}
      {showComments && (
        <CommentModal
          blogId={blog._id}
          isOpen={showComments}
          onClose={() => setShowComments(false)}
        />
      )}
      {showLikes && (
        <LikeModal
          blogId={blog._id}
          isOpen={showLikes}
          onClose={() => setShowLikes(false)}
        />
      )}
    </div>
  );
};

export default Blog;
