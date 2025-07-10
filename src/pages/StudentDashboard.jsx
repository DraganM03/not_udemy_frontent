import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { API_BASE_URL } from '../services/api';

const StudentDashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolled = async () => {
      try {
        const response = await api.get('/api/enrollments/my-courses');
        setEnrolledCourses(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolled();
  }, []);

  if (loading) return <div>Loading your courses...</div>;

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Learning</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {enrolledCourses.length > 0 ? (
          enrolledCourses.map((course) => (
            <Link
              to={`/course/${course.id}`}
              key={course.id}
              className="block bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
            >
              <img
                src={
                  course.thumbnail
                    ? `${API_BASE_URL}/static/${course.thumbnail}`
                    : 'https://placehold.co/600x400/e2e8f0/e2e8f0?text=.'
                }
                alt={course.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-md font-bold truncate">{course.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {course.instructor_name}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                  <div
                    className="bg-purple-600 h-2.5 rounded-full"
                    style={{ width: `${course.progress_percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-right mt-1">
                  {Math.round(course.progress_percentage)}% Complete
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p>
            You are not enrolled in any courses yet.{' '}
            <Link
              to="/"
              className="text-purple-600 cursor-pointer hover:underline"
            >
              Browse courses
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
