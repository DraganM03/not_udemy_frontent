import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const WatchCoursePage = () => {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const videoUrlRef = useRef(null);

  // Effect to fetch the initial course and lesson list
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseRes = await api.get(`/api/courses/${courseId}`);
        setCourse(courseRes.data);
        const sortedLessons = (courseRes.data.lessons || []).sort(
          (a, b) => a.order_index - b.order_index
        );
        setLessons(sortedLessons);

        // --- IMPROVEMENT: Automatically select the first lesson that has a video ---
        const firstPlayableLesson = sortedLessons.find((l) => l.video_path);
        if (firstPlayableLesson) {
          setCurrentLesson(firstPlayableLesson);
        } else if (sortedLessons.length > 0) {
          // If no lessons have videos, select the first one to show an appropriate message.
          setCurrentLesson(sortedLessons[0]);
        }
      } catch (err) {
        setError('Failed to load course data.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [courseId]);

  // Effect to fetch the video blob when the currentLesson changes
  useEffect(() => {
    console.log('Attempting to play lesson:', currentLesson);

    // If there's no lesson selected, do nothing.
    if (!currentLesson) return;

    // If the selected lesson has no video path, show an error.
    if (!currentLesson.video_path) {
      console.error(
        "This lesson object does not have a 'video_path' property or it is empty/null.",
        currentLesson
      );
      setVideoUrl(''); // Clear any previous video
      setError('This lesson does not have a video.');
      return;
    }

    const fetchVideo = async () => {
      setIsVideoLoading(true);
      setError('');

      // Memory leak fix
      if (videoUrlRef.current) {
        URL.revokeObjectURL(videoUrlRef.current);
      }

      try {
        const response = await api.get(
          `/api/lessons/stream/${currentLesson.id}`,
          {
            responseType: 'blob',
          }
        );

        const newUrl = URL.createObjectURL(response.data);
        videoUrlRef.current = newUrl;
        setVideoUrl(newUrl);
      } catch (err) {
        console.error('Failed to fetch video', err);
        setError('Could not load video for this lesson.');
        setVideoUrl(''); // Clear video on error
      } finally {
        setIsVideoLoading(false);
      }
    };

    fetchVideo();

    // Cleanup function to run when the component unmounts or currentLesson changes again
    return () => {
      if (videoUrlRef.current) {
        URL.revokeObjectURL(videoUrlRef.current);
      }
    };
  }, [currentLesson]);

  if (loading)
    return (
      <p className="text-center text-white text-lg p-10">Loading course...</p>
    );
  if (error && !course)
    return <p className="text-center text-red-500 text-lg p-10">{error}</p>;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-900 text-white">
      {/* Main Video Player */}
      <div className="flex-grow bg-black flex items-center justify-center">
        {isVideoLoading ? (
          <p>Loading video...</p>
        ) : videoUrl ? (
          <video key={videoUrl} controls autoPlay className="w-full h-full">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="text-center p-4">
            <p>{error || 'Select a lesson to begin watching.'}</p>
          </div>
        )}
      </div>

      {/* Lessons Sidebar */}
      <div className="w-full lg:w-80 bg-gray-800 p-4 overflow-y-auto flex-shrink-0">
        <Link
          to={`/course/${course?.id}`}
          className="text-purple-400 hover:underline mb-4 block"
        >
          &larr; Back to Course Page
        </Link>
        <h2 className="text-xl font-bold mb-4">{course?.title}</h2>
        <div className="space-y-2">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => setCurrentLesson(lesson)}
              className={`p-3 rounded cursor-pointer ${
                currentLesson?.id === lesson.id
                  ? 'bg-purple-600'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <p className="font-semibold">{lesson.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WatchCoursePage;
