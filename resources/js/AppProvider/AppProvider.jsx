import React from 'react';
import { ToastProvider } from '@/Contexts/ToastContext.jsx';
import { ThemeContextProvider } from '@/Contexts/ThemeContext.jsx';
import { arrayOf, node, oneOfType } from 'prop-types';
import ErrorBoundary from '@/AppErrorBoundary/ErrorBoundary.jsx';
import BaseLayout from '@/Layouts/BaseLayout.jsx';
import { AuthProvider } from '@/Hooks/useAuth/useAuth.jsx';

const AppProvider = ({ children }) => {
    return (
        <ErrorBoundary>
            <ToastProvider>
                <ThemeContextProvider>
                    <AuthProvider>
                        <BaseLayout>{children}</BaseLayout>
                    </AuthProvider>
                </ThemeContextProvider>
            </ToastProvider>
        </ErrorBoundary>
    );
};

export default AppProvider;

AppProvider.propTypes = {
    children: oneOfType([node, arrayOf(node)]),
};
