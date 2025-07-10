import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InstructorDashboard from './InstructorDashboard';
import StudentDashboard from './StudentDashboard';
import Spinner from '../components/Spinner';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return <Spinner />;
  }

  return user.role_name === 'instructor' ? (
    <InstructorDashboard />
  ) : (
    <StudentDashboard />
  );
};

export default DashboardPage;
