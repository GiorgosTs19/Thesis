import React from 'react'
import ReactDOM from 'react-dom';
import {arrayOf, bool, func, node, oneOfType, string} from "prop-types";
import clsx from "clsx";

const OffCanvas = ({
                       position, isOpen = false, onClose = () => {
    }, children
                   }) => {

    const getPositionClasses = () => {
        switch (position) {
            case 'left':
                return '-left-96 h-screen';
            case 'right':
                return '-right-96 h-screen';
            case 'top':
                return '-top-3/4 h-3/4';
            case 'bottom':
                return '-bottom-3/4 h-3/4';
            default:
                return '-right-full h-screen';
        }
    };

    const getHiddenClasses = () => {
        switch (position) {
            case 'left':
                return 'peer-checked:translate-x-full';
            case 'right':
                return 'peer-checked:-translate-x-full';
            case 'top':
                return 'peer-checked:translate-y-full -translate-y-3/4 w-full rounded-b-3xl';
            case 'bottom':
                return 'peer-checked:-translate-y-full translate-y-3/4 w-full rounded-t-3xl';
            default:
                return 'peer-checked:-translate-y-full';
        }
    };

    const handleClose = () => {
        onClose();
    }

    if (!document.getElementById('off-canvas'))
        return null;

    return ReactDOM.createPortal(
        <>
            {/*Toggle visibility button*/}
            <input className="peer hidden" type="checkbox" name="offcanvas" id="offcanvas" checked={isOpen} readOnly/>
            {/*BackDrop*/}
            {isOpen && (
                <div
                    className={styles.backDrop}
                    onClick={handleClose} // Close off-canvas when backdrop is clicked
                ></div>
            )}
            <div className='pointer-events-none fixed top-0 left-0 z-10 h-screen w-screen bg-gray-700/30 opacity-0 peer-checked:opacity-100 peer-checked:translate'></div>
            {/*Off Canvas*/}
            <div className={clsx(`${getPositionClasses()} ${getHiddenClasses()}`, styles.offCanvas)}>
                <div className={styles.closeButton} onClick={handleClose}/>
                <div className={styles.childrenWrapper}>
                    {children}
                </div>
            </div>
        </>
        ,
        document.getElementById('off-canvas')
    )
        ;
};
const styles = {
    backDrop: 'fixed top-0 left-0 z-20 w-full h-full bg-black opacity-50',
    closeButton: 'w-24 py-1 bg-gray-200 rounded-3xl mx-auto mt-5',
    childrenWrapper: 'my-auto flex w-full px-4 py-10 overflow-y-auto h-full',
    offCanvas: 'fixed z-30 flex flex-col max-w-full bg-white shadow-lg duration-300 transition-all'

}

OffCanvas.propTypes = {
    position: string.isRequired,
    onClose: func.isRequired,
    isOpen: bool.isRequired,
    children: oneOfType([node, arrayOf(node)])
}
export default OffCanvas;