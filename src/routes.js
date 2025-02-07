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
import UserList from './screens/UsersList';
import Beneficiaries from './screens/Beneficiaries';
import AdminTasks from './screens/AdminTasks';
import PQRSForm from './screens/PQRSForm';

const SecureRoute = ({ children }) => {
  const session = localStorage.getItem('session');

  if (session) {
    return children;
  } else {
    window.location.pathname = '/login';
  }
};

const AppRoutes = () => {
  const noNav = ['/login', '/register'];
  const session = localStorage.getItem('session');
  const session_data = session && JSON.parse(session);

  return (
    <Router>
      {!noNav.some((item) => window.location.pathname.startsWith(item)) && (
        <Navbar is_admin={session && session_data.is_admin} />
      )}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />

        <Route
          path="/"
          element={
            <SecureRoute>
              <Home />
            </SecureRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <SecureRoute>
              <Calendar />
            </SecureRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <SecureRoute>
              <Profile />
            </SecureRoute>
          }
        />
        <Route
          path="/pay"
          element={
            <SecureRoute>
              <Pay />
            </SecureRoute>
          }
        />
        <Route
          path="/beneficiaries"
          element={
            <SecureRoute>
              <Beneficiaries />
            </SecureRoute>
          }
        />
        <Route
          path="/pqrsdf"
          element={
            <SecureRoute>
              <PQRSForm />
            </SecureRoute>
          }
        />

        <Route
          path="/admin-users"
          element={
            <SecureRoute>
              <UserList />
            </SecureRoute>
          }
        />
        <Route
          path="/admin-tasks"
          element={
            <SecureRoute>
              <AdminTasks />
            </SecureRoute>
          }
        />
        <Route
          path="/admin-register"
          element={
            <SecureRoute>
              <Registration />
            </SecureRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
