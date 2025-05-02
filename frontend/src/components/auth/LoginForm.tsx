import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, Stack } from '@mui/material'; 

interface LoginFormProps {
    onSubmit: (credentials: { email: string; password: string }) => void;
    isLoading: boolean;
    error: string | null;
}

function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) { 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => { 
        event.preventDefault();
        onSubmit({ email, password });
    };

    return (
        // Box as the form container for styling with 'sx' prop
        <Box 
            component="form" 
            onSubmit={handleSubmit}
            sx={{
                mt: 1, // Margin top 1 unit
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', // Center items horizontally
            }}
        >
            <Typography component="h1" variant="h5"
                sx={{
                    color: '#646cffaa',
            }}
            > 
                Login
            </Typography>
            {/* Stack for vertical spacing of form elements */}
            <Stack spacing={2} sx={{ mt: 1, width: '100%' }}> 
              
                {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
                
                {/* TextField for input */}
                <TextField
                    margin="normal"
                    required
                    fullWidth 
                    id="login-email"
                    label="Email Address" 
                    name="email"
                    autoComplete="email"
                    autoFocus 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="login-password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                />
                {/* Use MUI Button */}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained" // background color/elevation
                    sx={{ mt: 3, mb: 2 }} // Margin top/bottom
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </Button>
            </Stack>
        </Box>
    );
}

export default LoginForm;

