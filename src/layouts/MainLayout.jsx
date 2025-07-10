import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Navbar />
      <main className="p-4 md:p-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
