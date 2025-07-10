import React, { useState } from 'react';
import api from '../services/api';

const AddLessonForm = ({ courseId, onLessonAdded, nextOrderIndex }) => {
  const [title, setTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !videoFile) {
      setError('Please provide a title and a video file.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    const lessonData = new FormData();
    lessonData.append('title', title);
    lessonData.append('video', videoFile);
    lessonData.append('course_id', courseId);
    lessonData.append('order_index', nextOrderIndex); // <-- ADDED order_index

    try {
      const response = await api.post('/api/lessons', lessonData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        alert('Lesson added successfully!');
        setTitle('');
        setVideoFile(null);
        e.target.reset();
        onLessonAdded();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add lesson.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 p-6 rounded-lg shadow-inner mt-6"
    >
      <h4 className="text-lg font-bold mb-4">Add New Lesson</h4>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Lesson Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Lesson Video</label>
        <input
          type="file"
          name="video"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
          accept="video/*"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-2 text-white bg-purple-600 rounded hover:bg-purple-700 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Uploading...' : 'Add Lesson'}
      </button>
    </form>
  );
};

export default AddLessonForm;
