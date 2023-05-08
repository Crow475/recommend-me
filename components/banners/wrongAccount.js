import Head from 'next/head';

import { useRouter } from 'next/router';
import { signOut } from "next-auth/react";

const {Card, Row, Col, Container, Button } = require('react-bootstrap');

export default function WrongAccount({text}) {
    const router = useRouter()

    return(
        <>
            <Head>
                <title>{text}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Container  className="position-absolute top-50 start-50 translate-middle">
                <Row>
                    <Col lg={{span: 4, offset: 4}} md={{span: 6, offset: 3}} sm={{span: 8, offset: 2}}>
                        <Card>
                            <Card.Body>
                                <Card.Title className='text-center'>{text}</Card.Title>
                                <Row className='mt-3 mx-1'>
                                    <Button onClick={() => router.back()} variant='secondary'>Back</Button>
                                </Row>
                                <br/>
                                <Row>
                                    <span className='text-center h5'>Wrong account?</span>
                                </Row>
                                <Row className='my-2 mx-1'>
                                    <Button onClick={() => signOut()}>Sign out</Button>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}