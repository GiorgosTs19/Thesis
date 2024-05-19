import React, { forwardRef } from 'react';
import { arrayOf, bool, func, node, number, oneOfType, string } from 'prop-types';
import Drawer from '@mui/material/Drawer';
import { useClickAway } from '@uidotdev/usehooks';
import { AiOutlineClose } from 'react-icons/ai';

const OffCanvas = forwardRef(function OffCanvas({ isOpen, position, onClose = () => {}, children, canvasWidth = 240, header = '', clickAwayClosable = false }, ref) {
    const drawerRef = useClickAway(() => {
        if (!clickAwayClosable) return;
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
                ref={drawerRef}
                hideBackdrop={true}
                sx={{
                    width: position === 'bottom' ? '100%' : canvasWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: position === 'bottom' ? '100%' : canvasWidth,
                        boxSizing: 'border-box',
                        maxHeight: position === 'bottom' || position === 'top' ? '75%' : '100%',
                        borderRadius: getBorderRadius(),
                        zIndex: 9999,
                    },
                }}
                variant={'temporary'}
                anchor={position}
                open={isOpen}
            >
                <div className={'align-items-center flex justify-between p-3'}>
                    <div className={'my-auto font-bold'}>{header}</div>
                    <AiOutlineClose size={32} className={'my-auto rotate-90 cursor-pointer'} onClick={handleDrawerClose} />
                </div>
                <div className={'border-t border-t-gray-100 px-3'} ref={ref}>
                    {children}
                </div>
            </Drawer>
        </>
    );
});

OffCanvas.propTypes = {
    header: string,
    position: string.isRequired,
    onClose: func.isRequired,
    isOpen: bool.isRequired,
    children: oneOfType([node, arrayOf(node)]),
    canvasWidth: number,
    clickAwayClosable: bool,
};
export default OffCanvas;
