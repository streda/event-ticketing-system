// frontend/src/components/auth/LoginForm.js

import React, {useState} from 'react'

function LoginForm({onSubmit, isLoading, error}){
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');

    const handleSubmit = (event) =>{
        event.preventDefault();
        onSubmit({email, password});
    }

    return(
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <div>
                <label htmlFor='login-email'>Email:</label>
                <input 
                    type='email'
                    id='login-email'
                    value={email}
                    required
                    disabled={isLoading}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor='login-password'>Password</label>
                <input 
                    type='password'
                    id='login-password'
                    value={password}
                    required
                    disabled={isLoading}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <button type='submit' disabled={isLoading}>
                {isLoading ? 'Logging in ...' : 'Login'}
            </button>
        </form>
    )
}

export default LoginForm;