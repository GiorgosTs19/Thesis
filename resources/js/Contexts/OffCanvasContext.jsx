import React, {createContext, useContext, useState} from 'react';
import OffCanvas from "@/Components/OffCanvas/OffCanvas.jsx";

const OffCanvasContext = createContext();

export const useOffCanvas = () => {
    const context = useContext(OffCanvasContext);
    if (!context) {
        throw new Error('useOffCanvas must be used within an OffCanvasProvider');
    }
    return context;
};

export const OffCanvasProvider = ({children}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState('right'); // Default position
    const [content, setContent] = useState(null);
    const openOffCanvas = (newPosition = 'right', cont) => {
        setContent(cont);
        setIsOpen(true);
        setPosition(newPosition);
    };

    const closeOffCanvas = () => {
        setIsOpen(false);
    };

    const contextValue = {
        isOpen,
        position,
        openOffCanvas,
        closeOffCanvas,
    }

    return (
        <OffCanvasContext.Provider value={contextValue}>
            <OffCanvas isOpen={isOpen} position={position} onClose={closeOffCanvas}>
                {content}
            </OffCanvas>
            {children}
        </OffCanvasContext.Provider>
    );
};