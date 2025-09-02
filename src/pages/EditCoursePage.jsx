import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import AddLessonForm from '../components/AddLessonForm';
import { FaPlayCircle, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const EditCoursePage = () => {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [originalLessons, setOriginalLessons] = useState([]);
  const [isOrderChanged, setIsOrderChanged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCourseAndLessons = useCallback(async () => {
    try {
      const courseRes = await api.get(`/api/courses/${courseId}`);
      const fetchedLessons = courseRes.data.lessons || [];
      setCourse(courseRes.data);
      setLessons(fetchedLessons);
      setOriginalLessons(fetchedLessons);
      setIsOrderChanged(false);
    } catch (err) {
      setError('Failed to load course data.');
      console.error(err);
    } finally {
      if (loading) setLoading(false);
    }
  }, [courseId, loading]);

  useEffect(() => {
    fetchCourseAndLessons();
  }, [fetchCourseAndLessons]);

  const handleMove = (index, direction) => {
    const newLessons = [...lessons];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newLessons.length) {
      return;
    }

    [newLessons[index], newLessons[targetIndex]] = [
      newLessons[targetIndex],
      newLessons[index],
    ];

    setLessons(newLessons);
    setIsOrderChanged(true);
  };

  const handleSaveOrder = async () => {
    const orderPayload = lessons.map((lesson, index) => ({
      id: lesson.id,
      order_index: index + 1,
    }));

    try {
      await api.patch('/api/lessons/order', { lessons: orderPayload });
      alert('Lesson order saved successfully!');
      fetchCourseAndLessons(); // Refresh data from server
    } catch (err) {
      setError('Failed to save lesson order.');
      console.error(err);
    }
  };

  if (loading) return <p>Loading course...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!course) return <p>Course not found.</p>;

  return (
    <div className="container mx-auto">
      <Link
        to="/dashboard"
        className="text-purple-600 hover:underline mb-6 inline-block"
      >
        &larr; Back to Dashboard
      </Link>
      <h1 className="text-3xl font-bold mb-6">Edit Course: {course.title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Course Details Form (Placeholder) */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Course Details</h2>
          <p className="text-gray-600">
            Course detail editing form would go here.
          </p>
        </div>

        {/* Lessons Management */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Course Lessons</h2>
            {isOrderChanged && (
              <button
                onClick={handleSaveOrder}
                className="bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600"
              >
                Save Lesson Order
              </button>
            )}
          </div>

          <div className="space-y-3 mb-6">
            {lessons.length > 0 ? (
              lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-3 bg-gray-100 rounded"
                >
                  <div className="flex items-center">
                    <FaPlayCircle className="text-gray-500 mr-3" />
                    <span>
                      {index + 1}. {lesson.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      className="p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <FaArrowUp />
                    </button>
                    <button
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === lessons.length - 1}
                      className="p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <FaArrowDown />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No lessons added yet.</p>
            )}
          </div>
          <AddLessonForm
            courseId={courseId}
            onLessonAdded={fetchCourseAndLessons}
            nextOrderIndex={lessons.length + 1}
          />
        </div>
      </div>
    </div>
  );
};

export default EditCoursePage;
