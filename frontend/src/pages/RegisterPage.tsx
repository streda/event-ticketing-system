// src/pages/RegisterPage.tsx  <-- In the pages directory!

import { useEffect, useState } from "react"; 
import { useDispatch, useSelector } from 'react-redux'; 
import { useNavigate } from 'react-router-dom';

import RegisterForm from "../components/auth/RegisterForm"; 

// ---> Import actions and types from Redux <---
import { registerUser, resetAuthStatus } from '../features/auth/authSlice'; 
import type { RootState, AppDispatch } from '../app/store'; // Import types

function RegisterPage() {
    // ---> Redux Hooks <---
    const dispatch: AppDispatch = useDispatch(); 
    const navigate = useNavigate();
    const { token, status, error } = useSelector((state: RootState) => state.auth); 
    
    const [registrationSuccess, setRegistrationSuccess] = useState(false); 

    // ---> Handle Submit by dispatching Redux action <---
    const handleSubmit = (formData: { name: string; email: string; password: string }) => {
        setRegistrationSuccess(false); 
        // ---> Dispatch the thunk <---
        dispatch(registerUser(formData)); 
    };

    // ---> Effect to handle registration success/failure <---
    useEffect(() => {
        let timerId: ReturnType<typeof setTimeout> | undefined;
        // Adding !token check to differentiate from login success
        if (status === 'succeeded' && !error && !token) { // Check Redux status
            console.log('Registration successful, redirecting to login...');
            setRegistrationSuccess(true); 
            timerId = setTimeout(() => {
                navigate('/login');
                // Calling dispatch here fixes redirection to HomePage 
                dispatch(resetAuthStatus()); // Reset Redux status immediately
        
            }, 1500); 
        } else if (status === 'failed') { // Handle 'failed' status 
            // Clears the success message if a subsequent attempt fails
            setRegistrationSuccess(false);
        }
        return () => {
            if(timerId){
                clearTimeout(timerId);
            }
        };

    }, [status, error, navigate, dispatch, token]); 

    // Redirect away if already logged in (e.g., user manually navigates back here)
    useEffect(() => {
        if (token) {
            navigate('/'); 
        }
    }, [token, navigate]);

    return (
        // ---> Render RegisterForm component <---
        <div>
            {registrationSuccess && <p style={{color: 'green'}}>Registration Successful! Redirecting to login...</p>}
            <RegisterForm 
                onSubmit={handleSubmit}
                // ---> Pass props based on Redux state <---
                isLoading={status === 'loading'} 
                error={status === 'failed' ? error : null} 
            />
        </div>
    );
}

export default RegisterPage;