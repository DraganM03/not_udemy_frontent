import React, { useState, useEffect, useCallback } from 'react';
import { FaPlusCircle, FaTimes } from 'react-icons/fa';
import api from '../services/api';
import InstructorCourseListItem from '../components/InstructorCourseListItem';
import CreateCourseForm from '../components/CreateCourseForm';

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchInstructorCourses = useCallback(async () => {
    setLoading(true);
    try {
      // NOTE: This assumes a new backend endpoint exists at GET /api/courses/instructor
      const response = await api.get('/api/courses/instructor');
      setCourses(response.data);
      setError(null);
    } catch (err) {
      setError(
        'Failed to fetch courses. Please ensure the backend endpoint exists.'
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInstructorCourses();
  }, [fetchInstructorCourses]);

  const handlePublish = async (courseId) => {
    try {
      await api.patch(`/api/courses/${courseId}`, { status: 'published' });
      alert('Course published successfully!');
      fetchInstructorCourses(); // Refresh the course list
    } catch (err) {
      alert(
        `Error publishing course: ${err.response?.data?.message || err.message}`
      );
    }
  };

  const onCourseCreated = () => {
    setShowCreateForm(false);
    fetchInstructorCourses(); // Refresh list after creating a new course
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700"
        >
          {showCreateForm ? (
            <>
              <FaTimes className="mr-2" />
              Cancel
            </>
          ) : (
            <>
              <FaPlusCircle className="mr-2" />
              Create New Course
            </>
          )}
        </button>
      </div>
      {showCreateForm && <CreateCourseForm onCourseCreated={onCourseCreated} />}
      <div className="mt-8">
        <h2 className="text-2xl font-bold">My Courses</h2>
        {loading ? (
          <p>Loading your courses...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="mt-4 space-y-4">
            {courses.length > 0 ? (
              courses.map((course) => (
                <InstructorCourseListItem
                  key={course.id}
                  course={course}
                  onPublish={handlePublish}
                />
              ))
            ) : (
              <p className="text-gray-500">
                You haven't created any courses yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
