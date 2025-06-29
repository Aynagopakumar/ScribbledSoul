import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import DashboardLayout from './components/DashboardLayout'; // or './pages/DashboardLayout'
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';


function App() {
  return (
    <>
      <Router>
        <Routes> 
        
          <Route path="/" element={<Layout />}>
          <Route path="profile" element={<Profile />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route index element={<Home />} />
          <Route path="/create" element={<CreateBlog />} />
          <Route path="blogs" element={<BlogList />} />
          <Route path="blogs/:id" element={<BlogView />} />
          <Route path="edit/:id" element={<EditBlog />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
               <Route path="profile" element={<Profile />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="settings" element={<Settings />} />
          </Route>

        </Route></Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;