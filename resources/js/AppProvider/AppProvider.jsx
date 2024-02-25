import React from 'react';
import {ToastProvider} from "@/Contexts/ToastContext.jsx";
import {ThemeContextProvider} from "@/Contexts/ThemeContext.jsx";
import {arrayOf, node, oneOfType} from "prop-types";
import ErrorBoundary from "@/AppErrorBoundary/ErrorBoundary.jsx";
import BaseLayout from "@/Layouts/BaseLayout.jsx";

const AppProvider = ({children}) => {
    return (
        <ErrorBoundary>
            <ToastProvider>
                <ThemeContextProvider>
                    <BaseLayout>
                        {children}
                    </BaseLayout>
                </ThemeContextProvider>
            </ToastProvider>
        </ErrorBoundary>
    )
}

export default AppProvider;

AppProvider.propTypes = {
    children: oneOfType([node, arrayOf(node)])
}
