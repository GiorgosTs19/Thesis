import React, { useEffect } from 'react';
import { useAuth } from '@/Hooks/useAuth/useAuth.jsx';
import { Card } from 'flowbite-react';
import { shape } from 'prop-types';
import useAPI from '@/Hooks/useAPI/useAPI.js';

const SuccessfulLogin = ({ authenticatedUser }) => {
    const { user, login } = useAuth();
    const api = useAPI();

    useEffect(() => {
        const timeout = setTimeout(() => {
            api.auth.goHome();
        }, 5000);
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
