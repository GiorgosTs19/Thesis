import React from 'react';
import {node, string} from 'prop-types';
import {Navigation} from "@/Components/Navigation/Navigation.jsx";
import {ToastProvider} from "@/Contexts/ToastContext.jsx";
import {ThemeContextProvider} from "@/Contexts/ThemeContext.jsx";

BaseLayout.propTypes = {
    title: string.isRequired,
    children: node.isRequired,
};

function BaseLayout({title, children}) {
    return (
        <div className="min-h-screen">
            <ThemeContextProvider>
                <ToastProvider>
                    <div id={'off-canvas'}></div>
                    <Navigation/>
                    <div className="bg-background w-full px-3 shadow-md mx-auto flex flex-col min-h-[calc(100vh-4rem)] relative">
                        {children}
                    </div>
                    {/*<FooterNavigation/>*/}
                </ToastProvider>
            </ThemeContextProvider>
        </div>
    );
}

export default BaseLayout;
