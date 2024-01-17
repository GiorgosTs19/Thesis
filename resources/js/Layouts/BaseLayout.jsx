import React from 'react';
import {node, string} from 'prop-types';
import {Navigation} from "@/Components/Navigation/Navigation.jsx";

BaseLayout.propTypes = {
    title: string.isRequired,
    children: node.isRequired,
};

function BaseLayout({title, children}) {
    return (
        <div className="min-h-full flex flex-col">
            <Navigation/>
            <div className="mt-4 w-full p-4 shadow-md mx-auto flex flex-col flex-grow">
                {children}
            </div>
        </div>
    );
}

export default BaseLayout;
