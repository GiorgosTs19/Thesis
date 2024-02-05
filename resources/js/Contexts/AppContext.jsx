// MyContextComponent.jsx

import React, {createContext, useContext, useState} from 'react';

// Create a context with an initial state
const MyContext = createContext();

// Create a provider component
export const MyContextProvider = ({children}) => {
    const [myState, setMyState] = useState(initialState);

    // Expose only the necessary parts of the state or functions
    const contextValue = {
        myState,
        updateMyState: (newValue) => {
            setMyState(newValue);
        },
    };

    return (
        <MyContext.Provider value={contextValue}>
            {children}
        </MyContext.Provider>
    );
};

// Create a custom hook to consume the context
export const useMyContext = () => {
    const context = useContext(MyContext);

    if (!context) {
        throw new Error('useMyContext must be used within a MyContextProvider');
    }

    return context;
};
