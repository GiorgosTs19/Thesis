// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { object } from 'prop-types';
import useAPI from '@/Hooks/useAPI/useAPI.js';
import { User } from '@/Models/User/User.js';
import {useLocalStorage} from "@uidotdev/usehooks";
import useEncryptedLocalStorage from "@/Hooks/useEncryptedLocalStorage/useEncryptedLocalStorage.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [pendingCheck, setPendingCheck] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userDetails, saveUserDetails, removeUserDetails] = useEncryptedLocalStorage("userDetails", null);
    const api = useAPI();

    useEffect(() => {
        if(userDetails){
            setIsAdmin(userDetails.ad)
            setUser(JSON.parse(userDetails.user))
            setPendingCheck(false)
            setIsLoggedIn(userDetails.logged)
            return;
        }
        api.auth.check().then(({ check, user }) => {
            setPendingCheck(false);
            setIsLoggedIn(check);
            if (!check) return;
            const userInstance = User.parseUserResponse(user);
            setUser(userInstance);
            setIsAdmin(userInstance.isAdmin);
            saveUserDetails({
                ad:userInstance.isAdmin,
                user:JSON.stringify(userInstance),
                logged:true
            })
        });
    }, [userDetails]);

    const login = (userData) => {
        // Logic for user authentication
        setUser(userData);
    };

    const logout = () => {
        api.auth.logout().then(()=> {
            setUser(null);
            setIsLoggedIn(false)
            removeUserDetails();
        });
    };

    return <AuthContext.Provider value={{ pendingCheck, isLoggedIn, user, isAdmin, login, logout }}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
    children: object,
};

export const useAuth = () => useContext(AuthContext);
