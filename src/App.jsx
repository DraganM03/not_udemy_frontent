import React from 'react';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext.jsx';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage.jsx';
import CoursePage from './pages/CoursePage';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import EditCoursePage from './pages/EditCoursePage';
import WatchCoursePage from './pages/WatchCoursePage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="/course/:id" element={<CoursePage />} />
      <Route path="/course/edit/:id" element={<EditCoursePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/watch/:id" element={<WatchCoursePage />} />
    </Route>
  )
);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
