import { Link, useNavigate } from 'react-router-dom';
import './Authentication.css';
import React, { useState } from 'react';
import { useUser } from '../context/useUser';

export const AuthenticationMode = Object.freeze({
    Login: 'Login',
    Register: 'Register'
});

export default function Authentication({ authenticationMode }) {
    const { signUp, signIn } = useUser();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure email and password are strings
        const sanitizedEmail = String(email).trim();
        const sanitizedPassword = String(password);

        try {
            if (authenticationMode === AuthenticationMode.Register) {
                await signUp(sanitizedEmail, sanitizedPassword);
                navigate('/signin');
            } else {
                await signIn(sanitizedEmail, sanitizedPassword);
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            const message = error.response && error.response.data ? error.response.data.error : error.message;
            alert(message);
        }
    };

    return (
        <div>
            <h3>{authenticationMode === AuthenticationMode.Login ? 'Sign in' : 'Sign up'}</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(String(e.target.value))} required />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(String(e.target.value))} required />
                </div>
                <div>
                    <button type="submit">{authenticationMode === AuthenticationMode.Login ? 'Login' : 'Submit'}</button>
                </div>
                <div>
                    <Link to={authenticationMode === AuthenticationMode.Login ? '/signup' : '/signin'}>
                        {authenticationMode === AuthenticationMode.Login ? 'No account? Sign up' : 'Already signed up? Sign in'}
                    </Link>
                </div>
            </form>
        </div>
    );
}
