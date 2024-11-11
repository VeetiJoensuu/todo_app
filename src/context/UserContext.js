import React, { createContext, useState } from 'react';
import axios from 'axios';

export const UserContext = createContext(); // Creates a context for user data

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Manages user state

    const signUp = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:3001/user/create', { email, password });
            setUser(response.data); // Updates user state with response data
        } catch (error) {
            console.error('Error during sign-up:', error);
            throw error;
        }
    };

    const signIn = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:3001/user/login', { email, password });
            setUser(response.data); // Updates user state with response data
            sessionStorage.setItem('user', JSON.stringify(response.data)); // Stores user data in session storage
        } catch (error) {
            console.error('Error during sign-in:', error);
            throw error;
        }
    };

    // Provides user data and authentication functions to children
    return (
        <UserContext.Provider value={{ user, signUp, signIn }}> 
            {children}
        </UserContext.Provider>
    );
};
