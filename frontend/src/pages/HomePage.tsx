// src/pages/HomePage.tsx

import { useSelector } from 'react-redux'; 
import { Box, Typography, Container, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { RootState } from '../app/store'; 

function HomePage() {
    // Authentication status from Redux
    // RootState for typing the state in useSelector
    const { token, user } = useSelector((state: RootState) => state.auth); 

    return (
        <Container maxWidth="md"> 
            <Box sx={{ my: 4, textAlign: 'center' }}> {/* vertical margin and center text */}
                
                <Typography variant="h3" component="h1" gutterBottom>
                    Welcome to EventLite!
                </Typography>

                {token && user ? (
                    // Content for Logged-in Users
                    <>
                        <Typography variant="h5" sx={{ mb: 2 }}>
                            Hello, {user.email}! 
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                            Browse upcoming events below or manage your bookings. 
                            (Event listing coming soon!)
                        </Typography>
                        {/* Button/Link to "My Bookings"  */}
                        {/* list of events */}
                    </>
                ) : (
                    // Content for Logged-out Users
                    <>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                            Your one-stop platform for discovering and booking tickets for exciting events.
                            Log in or register to get started. (Event listing coming soon!)
                        </Typography>
                        <Box>
                            <Button 
                                variant="contained" 
                                component={RouterLink} 
                                to="/login" 
                                sx={{ mr: 2 }} 
                            >
                                Login
                            </Button>
                            <Button 
                                variant="outlined" 
                                component={RouterLink} 
                                to="/register"
                            >
                                Register
                            </Button>
                        </Box>
                        {/* list of events  */}
                    </>
                )}

                {/* Placeholder for Event List */}
                 <Box sx={{ mt: 5, border: '1px dashed grey', p: 3 }}>
                     <Typography variant="h6">Upcoming Events</Typography>
                     <Typography variant="body2">(Event list will be displayed here)</Typography>
                     {/* I will Map over events fetched from Redux state */}
                 </Box>
            </Box>
        </Container>
    );
}

export default HomePage;