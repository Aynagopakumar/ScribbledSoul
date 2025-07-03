import React, { useState } from 'react';

const Settings = () => {
 const storedUser = JSON.parse(localStorage.getItem("user"));
const userName = storedUser?.username || 'User';
const userEmail = storedUser?.email || 'user@example.com';


  const [settings, setSettings] = useState({
    blogLanguage: 'English',
    adultContent: false,
    showWarning: true,
    searchVisible: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    console.log('Saved Settings:', settings);
    alert('Settings saved!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold mb-6">⚙️ Blog Settings</h1>

      {/* BASIC SETTINGS */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Basic</h2>
        <div className="space-y-6 bg-white p-6 rounded-xl shadow border">

          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Logged in as:</p>
              <p className="text-lg font-semibold text-blue-800">{userName} ({userEmail})</p>
            </div>
            <a
              href="/dashboard/profile"
              className="text-blue-600 underline hover:text-blue-800 text-sm"
            >
              View Profile →
            </a>
          </div>

          <div>
            <label className="block font-medium mb-1">Blog Language</label>
            <select
              name="blogLanguage"
              value={settings.blogLanguage}
              onChange={handleChange}
              className="block w-full border rounded px-3 py-2"
            >
              <option>English</option>
              <option>Malayalam</option>
              <option>Hindi</option>
              <option>Tamil</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="adultContent"
              checked={settings.adultContent}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <label>Contains Adult Content</label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="showWarning"
              checked={settings.showWarning}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <label>Show warning to blog readers</label>
          </div>
        </div>
      </section>

      {/* PRIVACY */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Privacy</h2>
        <div className="bg-white p-6 rounded-xl shadow border flex items-center gap-3">
          <input
            type="checkbox"
            name="searchVisible"
            checked={settings.searchVisible}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <label>Allow search engines to find your blog</label>
        </div>
      </section>

      {/* PUBLISHING */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Publishing</h2>
        <div className="bg-white p-6 rounded-xl shadow border text-gray-800 space-y-2 leading-relaxed">
          <p><strong>Blog Address:</strong> yourblog.example.com</p>
          <p><strong>Blog Admins:</strong> {userName} (You)</p>
          <p><strong>Pending Author Invites:</strong> None</p>
          <p><strong>Reader Access:</strong> Public</p>
        </div>
      </section>

      {/* SAVE BUTTON */}
      <div className="text-right pt-4">
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
