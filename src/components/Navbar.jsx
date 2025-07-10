import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-purple-600 cursor-pointer"
        >
          Totally Not Udemy
        </Link>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {user.role_name === 'instructor' && (
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600"
                >
                  Instructor Dashboard
                </Link>
              )}
              {user.role_name === 'student' && (
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600"
                >
                  My Learning
                </Link>
              )}
              <span className="text-gray-600">Welcome, {user.first_name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                <FaSignOutAlt />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-900 rounded-md hover:bg-gray-100"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-800"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
