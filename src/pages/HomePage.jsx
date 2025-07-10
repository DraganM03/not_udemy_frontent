import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CourseCard from '../components/CourseCard';
import Spinner from '../components/Spinner';
import { FaSearch } from 'react-icons/fa';

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for filters
  const [categories, setCategories] = useState([]);
  const [levels] = useState(['beginner', 'intermediate', 'advanced']);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch initial data (all courses and categories)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        // Fetch both courses and categories in parallel
        const [coursesResponse, categoriesResponse] = await Promise.all([
          api.get('/api/courses'),
          api.get('/api/categories'),
        ]);
        setCourses(coursesResponse.data);
        setCategories(categoriesResponse.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleFilterSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) {
        params.append('category', selectedCategory);
      }
      if (selectedLevel) {
        params.append('level', selectedLevel);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await api.get(`/api/courses?${params.toString()}`);
      setCourses(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Search Input */}
          <div className="md:col-span-2">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search Courses
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for anything"
                className="w-full p-2 border rounded-md pl-10"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          {/* Category Dropdown */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          {/* Level Dropdown */}
          <div>
            <label
              htmlFor="level"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Level
            </label>
            <select
              id="level"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">All Levels</option>
              {levels.map((level) => (
                <option key={level} value={level} className="capitalize">
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 text-right">
          <button
            onClick={handleFilterSearch}
            className="bg-purple-600 text-white font-bold py-2 px-6 rounded-md hover:bg-purple-700"
          >
            Search
          </button>
        </div>
      </div>

      {/* Courses Section */}
      <h1 className="text-3xl font-bold mb-6">A broad selection of courses</h1>
      {loading ? (
        <>
          <Spinner />
          <div className="text-center">Loading courses...</div>
        </>
      ) : error ? (
        <div className="text-center text-red-500">Error: {error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {courses.length > 0 ? (
            courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No courses found matching your criteria.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
