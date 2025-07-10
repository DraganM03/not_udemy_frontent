import React, { useState, useEffect } from 'react';
import api from '../services/api';

const CreateCourseForm = ({ onCourseCreated }) => {
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([
    { id: 1, name: 'beginner' },
    { id: 2, name: 'intermediate' },
    { id: 3, name: 'advanced' },
  ]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    category_id: '',
    level_id: '',
    price: '0.00',
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/api/categories');
        setCategories(res.data);
        if (res.data.length > 0) {
          setFormData((prev) => ({ ...prev, category_id: res.data[0].id }));
        }
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
    setFormData((prev) => ({ ...prev, level_id: levels[0].id }));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'thumbnail') {
      setThumbnailFile(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const courseData = new FormData();
      for (const key in formData) {
        courseData.append(key, formData[key]);
      }
      if (thumbnailFile) {
        courseData.append('thumbnail', thumbnailFile);
      }

      const response = await api.post('/api/courses', courseData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        alert('Course created successfully!');
        onCourseCreated();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">New Course Details</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <label className="block mb-1">Title</label>
        <input
          name="title"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Short Description</label>
        <input
          name="short_description"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Full Description</label>
        <textarea
          name="description"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="4"
          required
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block mb-1">Course Thumbnail</label>
        <input
          name="thumbnail"
          type="file"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          accept="image/*"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-1">Category</label>
          <select
            name="category_id"
            onChange={handleChange}
            value={formData.category_id}
            className="w-full p-2 border rounded"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Level</label>
          <select
            name="level_id"
            onChange={handleChange}
            value={formData.level_id}
            className="w-full p-2 border rounded"
          >
            {levels.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Price ($)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            onChange={handleChange}
            value={formData.price}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
      <button
        type="submit"
        className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Save Course
      </button>
    </form>
  );
};

export default CreateCourseForm;
