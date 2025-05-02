import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, Stack } from '@mui/material'; 


interface RegisterFormData {
    name: string;
    email: string;
    password: string; 
}

interface RegisterFormProps {
    onSubmit: (formData: RegisterFormData) => void;
    isLoading: boolean;
    error: string | null;
}

// RegisterForm receives {onSubmit, isLoading, and error} as props.
function RegisterForm({ onSubmit, isLoading, error }: RegisterFormProps) { 
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
   
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => { 
        event.preventDefault();
        onSubmit({ name, email, password }); 
    };

    return (
     
        <Box 
            component="form" 
            // When this internal <form> is submitted, it calls the onSubmit function it received as a prop, passing up the collected form data ({ name, email, password }).It doesn't know or care what that onSubmit function actually does (e.g., dispatching to Redux). 
            onSubmit={handleSubmit}
            sx={{
                mt: 1, 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', 
            }}
        >
            <Typography component="h1" variant="h5"> 
                Register
            </Typography>
           
            <Stack spacing={2} sx={{ mt: 1, width: '100%' }}> 
              
                {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="register-name"
                    label="Name"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                />
                {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
                
              
                <TextField
                    margin="normal"
                    required
                    fullWidth 
                    id="register-email" 
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
                    id="register-password" 
                    autoComplete="new-password"
                    inputProps={{ minLength: 6 }} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    helperText="Password must be at least 6 characters." 
                />
               
                <Button
                    type="submit"
                    fullWidth
                    variant="contained" 
                    sx={{ mt: 3, mb: 2 }} 
                    disabled={isLoading}
                >
                    {isLoading ? 'Registering...' : 'Register'} 
                </Button>
            </Stack>
        </Box>
    );
}

export default RegisterForm;
