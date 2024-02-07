import React from 'react';
import {node, string} from 'prop-types';
import {Navigation} from "@/Components/Navigation/Navigation.jsx";
import {ToastProvider} from "@/Contexts/ToastContext.jsx";

BaseLayout.propTypes = {
    title: string.isRequired,
    children: node.isRequired,
};

function BaseLayout({title, children}) {
    return (
        <div className="h-full flex flex-col">
            <ToastProvider>
                <Navigation/>
                <div className="bg-background w-full p-3 shadow-md mx-auto flex flex-col flex-grow xl:h-max">
                    <div className="flex items-center justify-self-end xl:h-full">
                        <div className="w-full px-6 flex flex-col rounded-lg xl:h-full">
                            {children}
                        </div>
                    </div>
                </div>
                {/*<FooterNavigation/>*/}
            </ToastProvider>
        </div>
    );
}

export default BaseLayout;
