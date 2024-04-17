import { Card } from 'flowbite-react';
import React from 'react';

const Login = () => {
    return (
        <Card className={'m-auto'}>
            <a href={route('Auth.Login')}>Login</a>
        </Card>
    );
};
export default Login;
