import dynamic from 'next/dynamic';
import CheckAccess from '@/lib/checkAccess';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const {Row, Col, Button, Form } = require('react-bootstrap');

const ConfirmProfileDelete = dynamic(() => import('../../components/dialogs/confirmProfileDelete'));

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export default function AccountSettings({ profile }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [showDelete, setShowDelete] = useState(false)
    
    function DeleteProfileButton() {
        return(
            <>
                <ConfirmProfileDelete 
                    show={showDelete} 
                    onCancel={() => setShowDelete(false)} 
                    onConfirm={handleDelete}
                />
                <Button
                    variant='danger'
                    onClick={() => setShowDelete(true)}
                >
                    Clear profile data
                </Button>
            </>
        )
    };

    const handleDelete = async () => {
        if (CheckAccess(profile, session)) {
            try {
                const body = {
                    profile: profile
                }
                const response = await fetch(BaseUrl + '/api/deleteProfile', {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body),
                })
                const data = await response.json()
                router.push('/')
                router.reload()
            } catch(err) {
                console.error(err)
            }
        }
    };
    
    return (
        <>
            <h2>Account settings</h2>
            <Form>
                <Row className='my-2'>
                    <h4>Interface</h4>
                </Row>
                <Row className='my-2 ms-2'>
                    <Col xs={6}>
                        <Form.Label>Preferred language</Form.Label>
                        <Form.Select defaultValue='english' disabled>
                            <option value='english'>English</option>
                            <option value='russian'>Russian</option>
                        </Form.Select>
                    </Col>
                </Row>
                <Row className='my-2 ms-2'>
                    <Col xs={6}>
                        <Form.Label>Preferred theme</Form.Label>
                        <Form.Select defaultValue='auto' disabled>
                            <option value='auto'>Auto</option>
                            <option value='light'>Light</option>
                            <option value='dark'>Dark</option>
                        </Form.Select>
                    </Col>
                </Row>
                <br />
                <Row className='my-2 justify-content-center'>
                    <Col xs={1}>
                        <Button variant='success' disabled>Apply</Button>
                    </Col>
                </Row>
                <Row className='my-2'>
                    <h4 className='text-danger'>Dangerous</h4>
                </Row>
                <Row className='my-2 ms-2'>
                    <Col xs={6} lg={4} xl={3}>
                        <DeleteProfileButton />
                    </Col>
                </Row>
            </Form>
        </>
    )
};