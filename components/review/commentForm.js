import dynamic from "next/dynamic";

import { useSession, signIn} from "next-auth/react";
import { useRouter } from 'next/router'
import { useState } from "react";

const {Button, ButtonToolbar, Row, Col, Form, Alert} = require('react-bootstrap');
const UsernameAndAvatar = dynamic(() => import('../profile/usernameAndAvatar'))

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export default function CommentForm({review}) {
    const { data: session } = useSession();
    const [alert, setAlert] = useState(false)
    const router = useRouter()
    
    const HandleSubmit = async (event) => {
        event.preventDefault()
        
        if (event.target.content.value.trim() !== "") {
            try {
                const body = {review: review, content: event.target.content.value.trim()};
                console.log(body)
                await fetch(BaseUrl + '/api/reactions/addComment', {
                    method: 'POST',
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(body)
                })
                router.reload(window.location.pathname)
            } catch(err) {
                console.error(err)
            }
        } else {
            setAlert(true)
        }
    }

    if (review.published) {
        if (session) {
            return(
                <Form className="mx-3" onSubmit={HandleSubmit}>
                    <UsernameAndAvatar username={session.user.name} avatar={session.user.image}/>
                    <Form.Group className="my-2">
                        <Form.Control as="textarea" rows={3} id="content" placeholder='Share your thoughts!'/>
                        <Alert show={alert} variant="danger" className="my-1" dismissible onClose={() => setAlert(false)}>
                            A comment cannot be empty!
                        </Alert>
                    </Form.Group>
                    <Row className='justify-content-end my-1'>
                        <Col sm={1} className="mx-3">
                            <Button type='submit' >Submit</Button>
                        </Col>
                    </Row>
                </Form>
            )
        }
        return(
            <ButtonToolbar>
                <span className="my-1">Sign in to leave a comment! </span>
                <Button size='me' variant='primary' className='mx-2' onClick={() => signIn()}>Sign in</Button>
            </ButtonToolbar>
            
        )
    }
}