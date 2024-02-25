import React from 'react';
import {node} from 'prop-types';
import {Navigation} from "@/Components/Navigation/Navigation.jsx";
import {ToastTypes, useToast} from "@/Contexts/ToastContext.jsx";
import {useAuthorizationErrorEventListener} from "@/Events/ErrorEvent/ErrorEvent.js";

BaseLayout.propTypes = {
    // title: string.isRequired,
    children: node.isRequired,
};

function BaseLayout({children}) {
    const {showToast} = useToast();

    // Listen to authorization Error Events thrown and show the appropriate toast message.
    useAuthorizationErrorEventListener((error) => {
        showToast(error.error, ToastTypes.ERROR, error.type, 5000);
    });

    return (
        <div className="min-h-screen">
            <div id={'off-canvas'}></div>
            <Navigation/>
            <div className="bg-background w-full px-3 shadow-md mx-auto flex flex-col min-h-[calc(100vh-4rem)] relative">
                {children}
            </div>
            {/*<FooterNavigation/>*/}
        </div>
    );
}

export default BaseLayout;
