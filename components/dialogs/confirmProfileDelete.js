import { useState } from 'react';
import { TrashFill, XLg } from 'react-bootstrap-icons';

const { Modal, Button, Form } = require("react-bootstrap");

export default function ConfirmProfileDelete({show, onCancel, onConfirm}) {
    const [confirmation, setConfirmation] = useState("")
    
    return(
        <Modal show={show} onHide={onCancel}>
            <Modal.Header>
                <Modal.Title>Confirm deleting profile data</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure you want to delete <strong>ALL</strong> of your profile data?</p>
                <p>This includes:</p>
                <ul>
                    <li>Reviews</li>
                    <li>Drafts</li>
                    <li>Comments</li>
                    <li>Likes and dislikes</li>
                    <li>User score and stats</li>
                    <li>Profile settings</li>
                </ul>
                <p className='text-danger'><strong>This action is not reversible!</strong></p>
                <Form>
                    <Form.Label>{'Type "CONFIRM" to proceed'}</Form.Label>
                    <Form.Control 
                        type='text' 
                        placeholder='CONFIRM' 
                        value={confirmation} 
                        onChange={(e) => setConfirmation(e.target.value)}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}><XLg size={20}/> <span className='align-text-top'>Cancel</span></Button>
                <Button variant="danger" onClick={onConfirm} disabled={confirmation !== "CONFIRM"}><TrashFill size={20}/> <span className='align-text-top'>Confirm</span></Button>
            </Modal.Footer>
        </Modal>
    )
}