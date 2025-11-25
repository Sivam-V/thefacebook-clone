import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Search from './pages/Search';
import Photos from './pages/Photos';
import Friends from './pages/Friends';
import Messages from './pages/Messages';
import Placeholder from './pages/Placeholder';
import './styles/global.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = React.useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/profile/edit" element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          } />
          <Route path="/profile/:id" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/search" element={
            <PrivateRoute>
              <Search />
            </PrivateRoute>
          } />
          <Route path="/profile/:id/photos" element={
            <PrivateRoute>
              <Photos />
            </PrivateRoute>
          } />
          <Route path="/friends" element={
            <PrivateRoute>
              <Friends />
            </PrivateRoute>
          } />
          <Route path="/profile/:id/friends" element={
            <PrivateRoute>
              <Friends />
            </PrivateRoute>
          } />

          {/* Placeholder Routes */}
          <Route path="/messages" element={
            <PrivateRoute>
              <Messages />
            </PrivateRoute>
          } />
          <Route path="/account" element={<PrivateRoute><Placeholder title="My Account" /></PrivateRoute>} />
          <Route path="/privacy" element={<PrivateRoute><Placeholder title="My Privacy" /></PrivateRoute>} />
          <Route path="/global" element={<PrivateRoute><Placeholder title="Global" /></PrivateRoute>} />
          <Route path="/social-net" element={<PrivateRoute><Placeholder title="Social Net" /></PrivateRoute>} />
          <Route path="/invite" element={<PrivateRoute><Placeholder title="Invite" /></PrivateRoute>} />
          <Route path="/faq" element={<PrivateRoute><Placeholder title="FAQ" /></PrivateRoute>} />
          <Route path="/about" element={<Placeholder title="About" />} />
          <Route path="/contact" element={<Placeholder title="Contact" />} />
          <Route path="/jobs" element={<Placeholder title="Jobs" />} />
          <Route path="/terms" element={<Placeholder title="Terms" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
