import { Link, useNavigate } from 'react-router-dom';
import './Authentication.css';
import React, { useState, useEffect } from 'react';
import { useUser } from '../context/useUser';

export const AuthenticationMode = Object.freeze({
    Login: 'Login',
    Register: 'Register'
});

export default function Authentication({ authenticationMode }) {
    const { user, setUser, signUp, signIn } = useUser();
    const navigate = useNavigate();
    const [email, setEmail] = useState(''); // State for email input
    const [password, setPassword] = useState(''); // State for password input

    const handleSubmit = async (e) => {
        e.preventDefault();

        const sanitizedEmail = String(email).trim();
        const sanitizedPassword = String(password);

        console.log('Email:', sanitizedEmail); // Sanitize email input
        console.log('Password:', sanitizedPassword); // Sanitize password input

        setUser({ email: sanitizedEmail, password: sanitizedPassword }); // Update user state
    };

    // Handle user login or registration
    useEffect(() => {
        const loginOrRegister = async () => {
            try {
                if (authenticationMode === AuthenticationMode.Register) {
                    await signUp();
                    navigate('/signin'); // Redirect to sign-in page after registration
                } else {
                    await signIn();
                    navigate('/'); // Redirect to home page after login
                }
            } catch (error) {
                console.error(error);
                const message = error.response && error.response.data ? error.response.data.error : error.message;
                alert(message);
            }
        };

        if (user.email && user.password) {
            loginOrRegister();
        }
    }, [user, signUp, signIn, authenticationMode, navigate]);

    return (
        <div className="auth-container">
            <div className="auth-form">
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
                        <Link to={authenticationMode === AuthenticationMode.Login ? '/signup' : '/signin'} className="link">
                            {authenticationMode === AuthenticationMode.Login ? 'No account? Sign up' : 'Already signed up? Sign in'}
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
