import React from 'react';

const notifications = [
  { id: 1, message: "New blog comment", createdAt: "2025-07-03T08:00:00Z" },
  { id: 2, message: "Your profile was updated", createdAt: "2025-07-02T12:30:00Z" },
];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const Notifications = () => {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">🔔 Notifications</h2>
      <div className="space-y-4">
        {notifications.map((note) => (
          <div key={note.id} className="bg-white shadow rounded-lg p-4 border">
            <p className="text-sm text-gray-800">{note.message}</p>
            <p className="text-xs text-gray-500 mt-1">{formatDate(note.createdAt)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
