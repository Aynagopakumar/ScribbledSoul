import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import Home from './pages/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toastify.override.css';
import EditBlog from './pages/EditBlog';
import CreateBlog from './pages/CreateBlog';
import BlogList from './pages/BlogList';
import BlogView from './pages/BlogView';
import DashboardLayout from './components/DashboardLayout';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* Redirect old paths to new dashboard routes */}
          <Route path="/blogs" element={<Navigate to="/dashboard/blogs" replace />} />
          <Route path="/blogs/:id" element={<Navigate to="/dashboard/blogs/:id" replace />} />
          <Route path="/blogs/:id/edit" element={<Navigate to="/dashboard/blogs/:id/edit" replace />} />

          {/* Dashboard routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
  <Route index element={<Navigate to="blogs" replace />} />
  <Route path="blogs" element={<BlogList />} />
  <Route path="blogs/:id" element={<BlogView />} />
  <Route path="blogs/:id/edit" element={<EditBlog />} />
  <Route path="create" element={<CreateBlog />} /> {/* ✅ FIXED */}
  <Route path="*" element={<div>404 Not Found</div>} />
  <Route path="profile" element={<Profile />} />
  <Route path="notifications" element={<Notifications />} />
  <Route path="settings" element={<Settings />} />
</Route>

        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
