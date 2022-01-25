import React from "react"
import { Button, Modal } from 'react-bootstrap';

const DeleteQuestion = ({ deleteHandleClose, show, deleteContent }) => {
  const activator = async (e) => {
    e.preventDefault()

    deleteContent()
    deleteHandleClose()
  }

  return (
    <>
      <Modal
        backdrop="static"
        keyboard={false}
        show={show}
        onHide={deleteHandleClose}
        dialogClassName="modal-sm"
        centered >

        <Modal.Header closeButton>
          <Modal.Title>Delete Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Do you want to delete this question?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={deleteHandleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={e => activator(e)}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default DeleteQuestion