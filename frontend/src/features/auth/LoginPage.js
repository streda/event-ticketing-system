// Pages using the forms and dispatching Redux thunks.s
import React, { useEffect } from "react";
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import LoginForm from "../../components/LoginForm";
import {loginUser, resetAuthStatus} from './authSlice'

function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {token, status, error} = useSelector((state) => state.auth);

    const handleSubmit = (credentials) => {
        dispatch(loginUser(credentials));
    };

    useEffect(() => {
        if(status === 'succeeded' && token){
            console.log('Login successful, navigating to home page...')
            dispatch(resetAuthStatus());
            navigate('/');
        }
        return () => {dispatch(clearAuthError());}
    }, [status, token, navigate, dispatch]);

    useEffect(() => {
        if(token){
            navigate('/')
        }
    }, [token, navigate]);

    return (
        <div>
            <LoginForm 
                onSubmit={handleSubmit}
                isLoading={status === 'loading'}
                error={status === 'failed' ? error : null}
            />
        </div>
    );
}

export default LoginPage;