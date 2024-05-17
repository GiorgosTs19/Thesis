import React, { useEffect } from 'react';
import { useAuth } from '@/Hooks/useAuth/useAuth.jsx';
import { Card } from 'flowbite-react';
import { shape } from 'prop-types';
import useAPI from '@/Hooks/useAPI/useAPI.js';

/**
 * SuccessfulLogin component handles the actions after a user has been successfully authenticated.
 *
 * @param {Object} authenticatedUser - The authenticated user object.
 * @returns {JSX.Element} The rendered SuccessfulLogin component.
 */
const SuccessfulLogin = ({ authenticatedUser }) => {
    const { login } = useAuth();
    const api = useAPI();

    useEffect(() => {
        const timeout = setTimeout(() => {
            api.auth.goHome();
        }, 5000);

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    useEffect(() => {
        if (authenticatedUser) {
            login(authenticatedUser);
        }
    }, [authenticatedUser, login]);

    return (
        <Card className={'m-auto text-center'}>
            You have been successfully authenticated.
            <div className={'text-gray-400'}>You will be redirected back to the homepage in 5 seconds.</div>
        </Card>
    );
};

SuccessfulLogin.propTypes = {
    authenticatedUser: shape({}),
};
export default SuccessfulLogin;
