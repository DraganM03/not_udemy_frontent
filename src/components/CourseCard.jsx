import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { API_BASE_URL } from '../services/api';

const CourseCard = ({ course }) => {
  return (
    <Link
      to={`/course/${course.id}`}
      className="block bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform hover:-translate-y-1 transition-transform duration-300"
    >
      <img
        src={
          course.thumbnail
            ? `${API_BASE_URL}/static/${course.thumbnail}`
            : 'https://placehold.co/600x400/e2e8f0/000000?text=no%20image'
        }
        alt={course.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="text-md font-bold truncate">{course.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{course.instructor_name}</p>
        <div className="flex items-center mt-2">
          <span className="text-yellow-500 font-bold mr-1">
            {course.average_rating
              ? Number(course.average_rating).toFixed(1)
              : 'New'}
          </span>
          <FaStar className="text-yellow-500" />
        </div>
        <p className="text-lg font-bold mt-2">{course.price}€</p>
      </div>
    </Link>
  );
};

export default CourseCard;
