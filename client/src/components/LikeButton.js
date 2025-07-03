import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LikeButton = ({ blogId, initialLikes }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) setUserId(user._id);
  }, []);

  const handleLike = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    const res = await axios.put(`/api/blogs/like/${blogId}`, {}, config);
    setLikes(res.data.likes);
  };

  const isLiked = likes.includes(userId);

  return (
    <button onClick={handleLike}>
      {isLiked ? '💖 Unlike' : '🤍 Like'} ({likes.length})
    </button>
  );
};

export default LikeButton;
