import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaStar, FaPlayCircle } from 'react-icons/fa';
import { API_BASE_URL } from '../services/api';

const CoursePage = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const courseRes = await api.get(`/api/courses/${courseId}`);
        setCourse(courseRes.data);

        const reviewsRes = await api.get(`/api/reviews/course/${courseId}`);
        setReviews(reviewsRes.data);

        // Check enrollment status if user is logged in
        if (isAuthenticated) {
          const enrollStatusRes = await api.get(
            `/api/enrollments/status/${courseId}`
          );
          setIsEnrolled(enrollStatusRes.data.isEnrolled);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [courseId, isAuthenticated]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const response = await api.post('/api/enrollments', {
        course_id: courseId,
      });
      if (response.status === 201) {
        alert('Successfully enrolled!');
        setIsEnrolled(true);
      }
    } catch (err) {
      alert(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;
  if (!course) return <div className="text-center">Course not found.</div>;

  const ActionButton = () => {
    if (user?.role_name === 'instructor') {
      return (
        <button
          onClick={() => navigate(`/course/edit/${courseId}`)}
          className="w-full mt-4 py-3 text-white font-bold bg-gray-600 rounded-md hover:bg-gray-700"
        >
          Edit Course
        </button>
      );
    }
    if (isEnrolled) {
      return (
        <button
          onClick={() => navigate(`/watch/${courseId}`)}
          className="w-full mt-4 py-3 text-white font-bold bg-green-600 rounded-md hover:bg-green-700"
        >
          Continue Learning
        </button>
      );
    }
    return (
      <button
        onClick={handleEnroll}
        className="w-full mt-4 py-3 text-white font-bold bg-purple-600 rounded-md hover:bg-purple-700"
      >
        Enroll now
      </button>
    );
  };

  return (
    <div className="container mx-auto">
      <div className="bg-gray-900 text-white p-8 rounded-t-lg">
        <h1 className="text-4xl font-bold">{course.title}</h1>
        <p className="text-xl mt-2">{course.short_description}</p>
        <p className="mt-4">
          Created by{' '}
          <span className="font-semibold">{course.instructor_name}</span>
        </p>
        <div className="flex items-center mt-2">
          <span className="text-yellow-400 font-bold mr-2">
            {course.average_rating
              ? Number(course.average_rating).toFixed(1)
              : 'New'}
          </span>
          <FaStar className="text-yellow-400" />
          <span className="ml-4">({course.enrollment_count} students)</span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 bg-white rounded-b-lg shadow-xl">
        <div className="lg:col-span-2">
          <div className="border p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>
            <p>{course.description}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Course content</h2>
            {course.lessons &&
              course.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex justify-between items-center p-4 border-b"
                >
                  <div className="flex items-center">
                    <FaPlayCircle className="text-gray-600 mr-4" />
                    <span>{lesson.title}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {Math.floor(lesson.video_duration_seconds / 60)}m
                  </span>
                </div>
              ))}
          </div>
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="border-b py-4">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-gray-700 text-white flex items-center justify-center font-bold mr-3">
                      {review.user_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold">{review.user_name}</p>
                      <div className="flex items-center">
                        {[...Array(review.rating)].map((_, i) => (
                          <FaStar key={i} className="text-yellow-500" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="border p-4 rounded-lg shadow-lg sticky top-24">
            <img
              src={
                course.thumbnail
                  ? `${API_BASE_URL}/static/${course.thumbnail}`
                  : 'https://placehold.co/600x400/e2e8f0/e2e8f0?text=.'
              }
              alt={course.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <p className="text-4xl font-bold">${course.price}</p>
              <ActionButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
