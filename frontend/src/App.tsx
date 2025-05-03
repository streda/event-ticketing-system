// Setup basic React Router (BrowserRouter, Routes, Route)

import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NavBar from './components/common/NavBar'; 
import { Box } from '@mui/material'; // MUI component for layout

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}> 
      {/* outer box a flex container, column direction, minimum full height */}
      <NavBar /> 
      <Box 
        component="main" 
        sx={{ 
          p: 3, 
          flexGrow: 1, //  grow and fill available space
          display: 'flex', // making the content area itself a flex container for its children
          flexDirection: 'column' // if children need column layout
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Box>
      {/* Optional Footer could go here */}
    </Box>
  );
}
export default App;