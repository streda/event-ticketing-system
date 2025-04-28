// Setup basic React Router (BrowserRouter, Routes, Route)

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NavBar from './components/common/NavBar'; 
import { Box } from '@mui/material'; // MUI component for layout

function App() {
  return (
    <> 
      <NavBar />
      <Box component="main" sx={{ p: 3 }}> {/* padding */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Box>
    </>
  );
}
export default App;