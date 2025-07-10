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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="/course/:id" element={<CoursePage />} />
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
