import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Button, Modal } from 'flowbite-react';
import { arrayOf, bool, func, node, oneOfType, string } from 'prop-types';
import { useClickAway } from '@uidotdev/usehooks';

const UtilityModal = forwardRef(function UtilityModal(
    { children, buttonClassName, open = false, header, footer, message, onAccept = () => {}, onDecline = () => {}, acceptText, declineText },
    ref,
) {
    const [openModal, setOpenModal] = useState(open);
    useImperativeHandle(
        ref,
        () => {
            return {
                open() {
                    setOpenModal(true);
                },
            };
        },
        [],
    );
    const modalRef = useClickAway(() => {
        setOpenModal(false);
    });

    const handleAccept = () => {
        onAccept();
        setOpenModal(false);
    };
    const handleDecline = () => {
        onDecline();
        setOpenModal(false);
    };
    return (
        <>
            <div onClick={() => setOpenModal(true)} className={buttonClassName} ref={ref}>
                {children}
            </div>
            <Modal show={openModal} onClose={() => setOpenModal(false)} ref={modalRef}>
                <Modal.Header>{header}</Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">{message}</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div>{footer}</div>
                    <Button onClick={handleAccept}>{acceptText}</Button>
                    <Button color="gray" onClick={handleDecline}>
                        {declineText}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
});

UtilityModal.propTypes = {
    children: oneOfType([node, arrayOf(node)]),
    buttonClassName: string,
    open: bool,
    header: string.isRequired,
    footer: string,
    message: string.isRequired,
    onAccept: func,
    onDecline: func,
    declineText: string.isRequired,
    acceptText: string.isRequired,
};
export default UtilityModal;
