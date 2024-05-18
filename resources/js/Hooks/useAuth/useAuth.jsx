// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { object } from 'prop-types';
import useAPI from '@/Hooks/useAPI/useAPI.js';
import { User } from '@/Models/User/User.js';
import useEncryptedLocalStorage from '@/Hooks/useEncryptedLocalStorage/useEncryptedLocalStorage.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [pendingCheck, setPendingCheck] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userDetails, saveUserDetails, removeUserDetails] = useEncryptedLocalStorage('userDetails');
    const api = useAPI();

    useEffect(() => {
        if (userDetails) {
            setIsAdmin(userDetails.ad);
            setUser(JSON.parse(userDetails.user));
            setPendingCheck(false);
            setIsLoggedIn(userDetails.logged);
            return;
        }

        api.auth.check().then(({ check, user }) => {
            setPendingCheck(false);
            setIsLoggedIn(check);
            if (!check) {
                removeUserDetails();
                return;
            }
            const userInstance = User.parseUserResponse(user);
            setUser(userInstance);
            setIsAdmin(userInstance.isAdmin);
            saveUserDetails({
                ad: userInstance.isAdmin,
                user: JSON.stringify(userInstance),
                logged: true,
            });
        });
    }, [userDetails]);

    const login = (userData) => {
        // Logic for user authentication
        setUser(userData);
    };

    const logout = () => {
        api.auth.logout().then(() => {
            setUser(null);
            setIsLoggedIn(false);
            setIsAdmin(false);
            removeUserDetails();
        });
    };

    return <AuthContext.Provider value={{ pendingCheck, isLoggedIn, user, isAdmin, login, logout }}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
    children: object,
};

/**
 * Custom hook to provide authentication context.
 *
 * This hook returns the authentication context, which includes the current user's
 * authentication status, user details, and functions to log in and logout.
 *
 * @returns {boolean} pendingCheck - Indicates if the authentication check is pending.
 * @returns {boolean} isLoggedIn - Indicates if the user is logged in.
 * @returns {Object|null} user - The current user object or null if not logged in.
 * @returns {boolean} isAdmin - Indicates if the current user has admin privileges.
 * @returns {function} login - Function to log in the user.
 * @returns {function} logout - Function to log out the user.
 *
 * @example
 * const { pendingCheck, isLoggedIn, user, isAdmin, login, logout } = useAuth();
 */
export const useAuth = () => useContext(AuthContext);
