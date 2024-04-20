import React, { useEffect } from 'react';
import { useAuth } from '@/Hooks/useAuth/useAuth.jsx';
import { Card } from 'flowbite-react';
import { shape } from 'prop-types';

const SuccessfulLogin = ({ authenticatedUser }) => {
    const { user, login } = useAuth();

    useEffect(() => {
        if (authenticatedUser) {
            login(authenticatedUser);
        }
    }, [authenticatedUser, login]);

    return <Card className={'m-auto'}>You have been successfully authenticated.</Card>;
};

SuccessfulLogin.propTypes = {
    authenticatedUser: shape({}),
};
export default SuccessfulLogin;
