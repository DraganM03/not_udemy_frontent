import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role_id: '1',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const registerResponse = await api.post('/api/users/register', formData);

      if (registerResponse.status === 201) {
        const loginResponse = await api.post('/api/users/login', {
          email: formData.email,
          password: formData.password,
        });

        const { user, token } = loginResponse.data;
        login(user, token); // Update the auth context

        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create a new account
        </h2>
        {error && (
          <p className="text-red-500 text-center mb-4">
            {error.includes('409')
              ? 'User With That Email Adress Already Exists!'
              : 'Something Went Wrong, Try Again!'}
          </p>
        )}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            name="first_name"
            placeholder="First Name"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="last_name"
            placeholder="Last Name"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <select
          name="role_id"
          onChange={handleChange}
          className="w-full p-2 border rounded mb-6"
        >
          <option value="1">Student</option>
          <option value="2">Instructor</option>
        </select>
        <button
          type="submit"
          className="w-full py-2 text-white font-bold bg-purple-600 rounded hover:bg-purple-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
