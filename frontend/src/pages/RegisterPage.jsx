import React, {useState} from "react";

function RegisterPage ({onSubmit, isLoading, error}){
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({email, password}) // Passing form data up
    };
    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <div>
                <label htmlFor="register-email">Email:</label>
                <input
                    type="'email"
                    id="register-email"
                    value={email}
                    required
                    disabled={isLoading}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor="register-password">Password:</label>
                <input 
                    type="password"
                    id="register-password"
                    value={password}
                    minLength="6"
                    required
                    disabled={isLoading}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <button 
                type="submit"
                disabled={isLoading}
            >
                {isLoading ? 'Registering' : 'Register'}
            </button>
        </form>
    )
}

export default RegisterPage;