import React from 'react';
import PropTypes, {node, string} from 'prop-types';
import {Navigation} from "@/Components/Navigation/Navigation.jsx";

BaseLayout.propTypes = {
    title:string.isRequired,
    children:node.isRequired,
};

function BaseLayout({title, children}) {
    return (
        <div className="min-h-full flex flex-col">
            <Navigation/>
            <header className="bg-white shadow">
                <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
                </div>
            </header>
            <div className="mt-8 w-full p-6 shadow-md m-auto flex flex-col flex-grow ">
                {children}
            </div>
        </div>
    );
}

export default BaseLayout;
