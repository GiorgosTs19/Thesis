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
                {children}
            </div>
            <FooterNavigation/>
        </div>
    );
}

export default BaseLayout;
