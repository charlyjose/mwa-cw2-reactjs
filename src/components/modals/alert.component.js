import React from "react"
import { Button, Modal } from 'react-bootstrap';

const AlertModal = ({ modalHandleClose, show, alertMessage }) => {
    return (
        <>
            <Modal
                backdrop="static"
                keyboard={false}
                show={show}
                onHide={modalHandleClose}
                dialogClassName="modal-sm"
                centered >

                <Modal.Header closeButton>
                    <Modal.Title>Alert</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {alertMessage}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={modalHandleClose}>
                        Okay
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AlertModal