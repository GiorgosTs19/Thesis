import React from 'react';
import { arrayOf, bool, func, node, number, oneOfType, string } from 'prop-types';
import Drawer from '@mui/material/Drawer';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid/index.js';
import { useClickAway } from '@uidotdev/usehooks';

const OffCanvas = ({ isOpen, position, onClose = () => {}, children, width = 240, header = '' }) => {
    const ref = useClickAway(() => {
        onClose();
    });

    if (!document.getElementById('off-canvas')) return null;

    const handleDrawerClose = () => {
        onClose();
    };

    const getBorderRadius = () => {
        switch (position) {
            case 'top':
                return '0 0 25px 25px';
            case 'bottom':
                return '25px 25px 0 0';
            case 'left':
                return '0 10px 10px 0';
            case 'right':
                return '10px 0 0 10px';
        }
    };

    return (
        <>
            <Drawer
                ref={ref}
                hideBackdrop={true}
                sx={{
                    width: position === 'bottom' ? '100%' : width,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: position === 'bottom' ? '100%' : width,
                        boxSizing: 'border-box',
                        maxHeight: position === 'bottom' || position === 'top' ? '75%' : '100%',
                        borderRadius: getBorderRadius(),
                        zIndex: 9999,
                    },
                }}
                variant="temporary"
                anchor={position}
                open={isOpen}
            >
                <div className={'align-items-center flex justify-between p-2'}>
                    <div className={'font-bold'}>{header}</div>
                    <div onClick={handleDrawerClose}>{position === 'left' ? <ChevronLeftIcon /> : <ChevronRightIcon />}</div>
                </div>
                <div className={'mt-5 border-t border-t-gray-100'}>{children}</div>
            </Drawer>
        </>
    );
};
const styles = {
    backDrop: 'fixed top-0 left-0 z-20 w-full h-full bg-black opacity-50',
    closeButton: 'w-24 py-1 bg-gray-200 rounded-3xl mx-auto mt-5',
    childrenWrapper: 'my-auto flex w-full px-4 py-10 overflow-y-auto h-full',
    offCanvas: 'fixed z-30 flex flex-col max-w-full bg-white shadow-lg duration-300 transition-all',
};

OffCanvas.propTypes = {
    header: string,
    position: string.isRequired,
    onClose: func.isRequired,
    isOpen: bool.isRequired,
    children: oneOfType([node, arrayOf(node)]),
    width: number,
};
export default OffCanvas;
