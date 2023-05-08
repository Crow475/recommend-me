import { TrashFill, XLg } from 'react-bootstrap-icons';

const { Modal, Button } = require("react-bootstrap");

export default function ConfirmDelete({show, onCancel, onConfirm, header, text}) {
    return(
        <Modal show={show} onHide={onCancel}>
            <Modal.Header>
                <Modal.Title>{header}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{text}</p>
                <p><strong>This action is not reversible!</strong></p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}><XLg size={20}/> <span className='align-text-top'>Cancel</span></Button>
                <Button variant="danger" onClick={onConfirm}><TrashFill size={20}/> <span className='align-text-top'>Confirm</span></Button>
            </Modal.Footer>
        </Modal>
    )
}