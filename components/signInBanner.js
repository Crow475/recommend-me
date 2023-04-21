import { signIn } from "next-auth/react";

import 'bootstrap/dist/css/bootstrap.min.css';

const {Modal, Button} = require('react-bootstrap');

export default function SignInBanner(show, handleHide) {
    return(
        <Modal show={show} onHide={handleHide}>
            <Modal.Header closeButton>
                <Modal.Title>Sign in to rate reviews!</Modal.Title>
            </Modal.Header>
            <Modal.Body>Join the community and you will be able to like, dislike and leave comments under reviews!</Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={() => handleHide}>
                    Close
                </Button>
                <Button variant='primary' onClick={() => signIn}>
                    Sign in
                </Button>
            </Modal.Footer>
        </Modal>
    )
}