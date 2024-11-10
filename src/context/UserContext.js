import React, { createContext, useState } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const signUp = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:3001/user/create', { email, password });
            setUser(response.data);
        } catch (error) {
            console.error('Error during sign-up:', error);
            throw error;
        }
    };

    const signIn = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:3001/user/login', { email, password });
            setUser(response.data);
        } catch (error) {
            console.error('Error during sign-in:', error);
            throw error;
        }
    };

    return (
        <UserContext.Provider value={{ user, signUp, signIn }}>
            {children}
        </UserContext.Provider>
    );
};