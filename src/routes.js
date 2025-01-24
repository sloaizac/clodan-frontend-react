import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
/*import Home from './pages/Home';*/
import Navbar from './components/Navbar';
import Login from './screens/Login';
import Registration from './screens/Registration';
import Home from './screens/Home';
import Calendar from './screens/Calendar';
import Profile from './screens/Profile';
import Pay from './screens/Pay';

const AppRoutes = () => {
  const noNav = ['/login', '/register'];
  return (
    <Router>
      {!noNav.some((item) => window.location.pathname.startsWith(item)) && (
        <Navbar />
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/pay" element={<Pay />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
