import React from 'react';
import { Link } from 'react-router-dom';

const Blog = ({ blog }) => {
  console.log('Blog author:', blog.author);

  return (
    <div className="border rounded shadow-md p-4 mb-6 bg-white hover:shadow-lg transition-all">
      {/* Blog Title */}
      <Link to={`/blogs/${blog._id}`}>
        <h3 className="text-xl font-semibold mb-2 text-blue-700 hover:underline">
          {blog.title}
        </h3>
      </Link>

      {/* Blog Content Preview */}
      <p
        className="text-gray-600 text-sm"
        dangerouslySetInnerHTML={{
          __html: blog.content?.substring(0, 150) + '...',
        }}
      />

      {/* Author and Date */}
      <div className="text-xs text-gray-500 mt-2">
        Posted by <span className="font-medium">{blog?.author?.username || 'Unknown'}</span> on{' '}
        {new Date(blog.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default Blog;
