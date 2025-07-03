import React, { useEffect, useState } from 'react';
import axios from 'axios';


const LikeModal = ({ blogId, isOpen, onClose }) => {
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchLikes = async () => {
  try {
    const res = await axios.get(`/api/blogs/${blogId}`);
    const likeUsers = res.data.blog.likes; // ✅ populated with usernames/emails
    setLikes(likeUsers);
  } catch (err) {
    console.error('Failed to fetch likes', err);
  }
};

    fetchLikes();
  }, [isOpen, blogId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">People who liked this</h2>
        {likes.length === 0 ? (
          <p className="text-gray-500">No likes yet</p>
        ) : (
          <ul className="space-y-2">
            {likes.map((user, idx) => (
              <li key={idx} className="text-gray-700">
                {user.username || user.email || 'Anonymous'}
              </li>
            ))}
          </ul>
        )}
        <button
          className="mt-4 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default LikeModal;
