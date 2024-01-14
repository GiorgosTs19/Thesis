import './bootstrap';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/inertia-react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import React from "react";
const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const jsxFiles = import.meta.glob('./Pages/**/*.jsx');
const tsxFiles = import.meta.glob('./Pages/**/*.tsx');

const allFiles = { ...jsxFiles, ...tsxFiles };
createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const jsxPath = `./Pages/${name}.jsx`;
        const tsxPath = `./Pages/${name}.tsx`;

        if (allFiles[jsxPath]) {
            return resolvePageComponent(jsxPath, allFiles);
        } else if (allFiles[tsxPath]) {
            return resolvePageComponent(tsxPath, allFiles);
        } else {
            // Handle the case where neither .jsx nor .tsx files are found
            console.error(`File not found for ${name}`);
            return null;
        }
    },
    setup({el, App, props}) {
        const root = createRoot(el);

        root.render(<App {...props}/>);
    },
}).then(r =>{});
