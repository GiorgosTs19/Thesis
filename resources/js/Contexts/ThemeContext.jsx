import React, {createContext, useContext} from 'react';
import {arrayOf, node, oneOfType} from "prop-types";

// Create a context with an initial state
const ThemeContext = createContext();

// Create a provider component
export const ThemeContextProvider = ({children}) => {

    // Expose only the necessary parts of the state or functions
    const contextValue = {};

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};

ThemeContextProvider.propTypes = {
    children: oneOfType(([node, arrayOf(node)]))
}

// Create a custom hook to consume the context
export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme must be used within a ThemeContextProvider');
    }

    return context;
};
