import React from 'react';
import {node, string} from 'prop-types';
import {Navigation} from "@/Components/Navigation/Navigation.jsx";
import {FooterNavigation} from "@/Components/FooterNavigation/FooterNavigation.jsx";

BaseLayout.propTypes = {
    title: string.isRequired,
    children: node.isRequired,
};

function BaseLayout({title, children}) {
    return (
        <div className="min-h-full flex flex-col">
            <Navigation/>
            <div className="mt-2 w-full p-3 shadow-md mx-auto flex flex-col flex-grow h-full">
                <div className="bg-gray-100 flex items-center justify-self-end h-full">
                    <div className="w-full px-6 py-3 flex flex-col h-full rounded-lg">
                        {children}
                    </div>
                </div>
            </div>
            <FooterNavigation/>
        </div>
    );
}

export default BaseLayout;
