// src/pages/LoginPage.tsx (Or features/auth/LoginPage.tsx if you didn't move it yet)

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from '../app/hooks'; 
import { useNavigate } from 'react-router-dom';
import LoginForm from "../components/auth/LoginForm"; 
import { loginUser, resetAuthStatus } from '../features/auth/authSlice'; 

function LoginPage() {
    const dispatch = useAppDispatch(); 
    const navigate = useNavigate();

    const { token, status, error } = useAppSelector((state) => state.auth);
    
    const handleSubmit = (credentials: { email: string; password: string }) => {
        dispatch(loginUser(credentials)); 
    };

    useEffect(() => {
        if (status === 'succeeded' && token) {
            console.log('Login successful, navigating to home page...')
            dispatch(resetAuthStatus());
            navigate('/');
        }
    }, [status, token, navigate, dispatch]);

    useEffect(() => {
        if (token) {
            navigate('/')
        }
    }, [token, navigate]);

    return (
        <div>
            <LoginForm 
                onSubmit={handleSubmit}
                isLoading={status === 'loading'}
                error={status === 'failed' ? error ?? null : null}
            />
        </div>
    );
}

export default LoginPage;









// // Pages using the forms and dispatching Redux thunks.s
// import { useEffect } from "react";
// import {useDispatch, useSelector} from 'react-redux';
// import {useNavigate} from 'react-router-dom';
// import LoginForm from "../components/auth/LoginForm";
// import {loginUser, resetAuthStatus} from '../features/auth/authSlice'

// function LoginPage() {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const {token, status, error} = useSelector((state: { 
//         auth: 
//         { 
//             token: string | null; 
//             status: string; 
//             error: string | null 
//         } 
//     }) => state.auth);

//     const handleSubmit = (credentials: { email: string; password: string }) => {
//         dispatch(loginUser(credentials));
//     };

//     useEffect(() => {
//         if(status === 'succeeded' && token){
//             console.log('Login successful, navigating to home page...')
//             dispatch(resetAuthStatus());
//             navigate('/');
//         }
//     }, [status, token, navigate, dispatch]);

//     useEffect(() => {
//         if(token){
//             navigate('/')
//         }
//     }, [token, navigate]);

//     return (
//         <div>
//             <LoginForm 
//                 onSubmit={handleSubmit}
//                 isLoading={status === 'loading'}
//                 error={status === 'failed' ? error : null}
//             />
//         </div>
//     );
// }

// export default LoginPage;