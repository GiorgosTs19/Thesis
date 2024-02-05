import React, {useState} from "react";
import {Button, Modal} from "flowbite-react";
import {arrayOf, bool, func, node, oneOfType, string} from "prop-types";

const UtilityModal = ({
                          children, buttonClassName, open = false, header, footer, message, onAccept = () => {
    }, onDecline = () => {
    }, acceptText, declineText
                      }) => {
    const [openModal, setOpenModal] = useState(open);
    const handleAccept = () => {
        onAccept();
        setOpenModal(false);
    }
    const handleDecline = () => {
        onDecline();
        setOpenModal(false);
    }
    return (
        <>
            <div onClick={() => setOpenModal(true)} className={buttonClassName}>{children}</div>
            <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>{header}</Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                            {message}
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleAccept}>{acceptText}</Button>
                    <Button color="gray" onClick={handleDecline}>
                        {declineText}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

UtilityModal.propTypes = {
    children: oneOfType([node, arrayOf(node)]).isRequired,
    buttonClassName: string,
    open: bool,
    header: string.isRequired,
    footer: string,
    message: string.isRequired,
    onAccept: func,
    onDecline: func,
    declineText: string.isRequired,
    acceptText: string.isRequired,
}
export default UtilityModal;
