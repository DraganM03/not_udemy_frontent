import React from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../services/api';

const InstructorCourseListItem = ({ course, onPublish }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between flex-wrap">
      <div className="flex items-center mb-4 md:mb-0">
        <img
          src={
            course.thumbnail
              ? `${API_BASE_URL}/static/${course.thumbnail}`
              : 'https://placehold.co/150x100/e2e8f0/e2e8f0?text=.'
          }
          alt={course.title}
          className="w-32 h-20 object-cover rounded-md mr-4"
        />
        <div>
          <h3 className="text-lg font-bold">{course.title}</h3>
          <p className="text-sm text-gray-500">
            {course.category_name || 'No Category'}
          </p>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusClass(
              course.status
            )}`}
          >
            {course.status}
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {course.status === 'draft' && (
          <button
            onClick={() => onPublish(course.id)}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Publish
          </button>
        )}
        <Link
          to={`/course/edit/${course.id}`}
          className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300"
        >
          Edit
        </Link>
      </div>
    </div>
  );
};

export default InstructorCourseListItem;
