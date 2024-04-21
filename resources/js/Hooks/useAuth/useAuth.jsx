// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { object } from 'prop-types';
import useAPI from '@/Hooks/useAPI/useAPI.js';
import { User } from '@/Models/User/User.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [pendingCheck, setPendingCheck] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    const api = useAPI();

    useEffect(() => {
        api.auth.check().then(({ check, user }) => {
            setPendingCheck(false);
            setIsLoggedIn(check);
            if (!check) return;
            const userInstance = User.parseUserResponse(user);
            setUser(userInstance);
            setIsAdmin(userInstance.isAdmin);
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

    return <AuthContext.Provider value={{ pendingCheck, isLoggedIn, user, isAdmin, login, logout }}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
    children: object,
};

export const useAuth = () => useContext(AuthContext);
