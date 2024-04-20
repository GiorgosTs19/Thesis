// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { object } from 'prop-types';
import useAPI from '@/Hooks/useAPI/useAPI.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const api = useAPI();

    useEffect(() => {
        api.auth.check().then(({ check, user }) => {
            setIsLoggedIn(check);
            if (!check) return;
            setUser(user);
        });
    }, []);

    const login = (userData) => {
        // Logic for user authentication
        setUser(userData);
    };

    const logout = () => {
        // Logic for user logout
        setUser(null);
    };

    return <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
    children: object,
};

export const useAuth = () => useContext(AuthContext);
