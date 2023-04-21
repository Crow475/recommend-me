import Head from 'next/head';
import dynamic from 'next/dynamic';
import styles from '@/styles/Review.module.css'

import { useState } from 'react';
import { InfoCircleFill, TrashFill, CheckLg } from 'react-bootstrap-icons';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

const {Card, Badge, Row, Col, Container, Accordion, Image, Button, Form, ButtonToolbar} = require('react-bootstrap');

const UsernameAndAvatar = dynamic(() => import('../components/usernameAndAvatar'));

export default function Create() {
    const { data: session } = useSession();
    const router = useRouter()
    const [rating, setRating] = useState(-1)
    const [header, setHeader] = useState('Create a new review!')
    const [reviewImage, setReviewImage] = useState("")
    
    var badgeVariant = 'danger'
    
    if (rating === -1) {
        badgeVariant = 'secondary'
    } else if (rating > 6) {
        badgeVariant = 'success'
    } else if (rating > 3) {
        badgeVariant = 'warning'
    }

    function ImagePreview() {
        if (reviewImage) {
            console.log(reviewImage)
            return(
                <Row className='my-1 mx-1'>
                    <Card>
                        <div className={styles.image}>
                            <Card.Header>
                                <Image src={reviewImage} alt='Review image' thumbnail />
                            </Card.Header>
                        </div>
                    </Card>
                </Row>
            )
        }
    }

    if (session) {
        return(
            <>
                <Head>
                    <title>RecommendMe - Create</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Head>
                <main>
                    <Container fluid>
                        <Form>    
                            <Row className='my-2'>
                                <Col xs={8} lg={9} xl={10}>
                                    <h1>
                                        <Badge bg={badgeVariant}>{(rating === -1)?"?":rating}/10</Badge> 
                                        <span> {(header === "")?"Review header":header}</span>
                                    </h1>
                                </Col>
                                <Col  xs={4} lg={3} xl={2}>
                                    <ButtonToolbar className='my-2'>
                                        <Button variant='danger' className='mx-1' onClick={() => router.back()}>
                                            <TrashFill size={20}/>
                                            <span className='d-none d-xl-inline'> Discard</span>
                                        </Button>
                                        <Button type='submit' variant='success'>
                                            <CheckLg size={20}/>
                                            <span className='d-none d-lg-inline'> Submit</span>
                                        </Button>
                                    </ButtonToolbar>
                                </Col>
                            </Row>
                            <Row className='my-2'>
                                <Col lg={3}>
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>
                                                <InfoCircleFill size={20} className='mx-2'/> 
                                                <span> Review info</span>
                                            </Card.Title>
                                            <Row className='my-1 py-2'>
                                                <Form.Label htmlFor='inputHeader'>Header</Form.Label>
                                                <Form.Control type='text' placeholder='Write a descriptive header!' id='inputHeader' onChange={(e) => setHeader(e.target.value)} />
                                            </Row>
                                            <Row className='my-1 py-2'>
                                                <Form.Label>Work</Form.Label>
                                                <Form.Control type='text' placeholder='Name of the movie, game, book, etc.' />
                                            </Row>
                                            <Row className='my-1 py-2'>
                                                <Form.Label>Rating</Form.Label>
                                                <Form.Range max={10} min={0} step={1} value={rating} onChange={(e) => setRating(e.target.value)}/>
                                                <Form.Text>How did you like it on a scale of 10?</Form.Text>
                                            </Row>
                                            <Row className='my-1 py-2'>
                                                <Col xs={6}>
                                                    <UsernameAndAvatar username={session.user.name} avatar={session.user.profile.image}/>
                                                </Col>
                                                <Col xs={6}>
                                                    2023/1/1 00:00
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xs={12} lg={8}  className={styles.content}>
                                    <Row className='my-1 mx-1'>
                                        <Form.Label>Add cover image to your review!</Form.Label>
                                        <Form.Control type="file" onChange={(e) => setReviewImage(e.target.value)}/>
                                    </Row>
                                    <ImagePreview/>
                                    <Row className='my-1 mx-1'>
                                        <Form.Control as='textarea' rows={20} placeholder='The text of the review goes here!'/>
                                    </Row>
                                </Col>
                            </Row>
                        </Form>
                    </Container>
                </main>
            </>
        )
    } else {
        return(
            <Container  className="position-absolute top-50 start-50 translate-middle">
                <Row>
                    <Col lg={{span: 4, offset: 4}} md={{span: 6, offset: 3}} sm={{span: 8, offset: 2}}>
                        <Card>
                            <Card.Body>
                                <Card.Title>You need to be signed in to write reviews!</Card.Title>
                                <br/>
                                <Row className='my-2 mx-1'>
                                    <Button onClick={() => signIn()}>Sign in</Button>
                                </Row>
                                <hr/>
                                <Row className='my-2 mx-1'>
                                    <Button onClick={() => router.back()} variant='secondary'>Cancel</Button>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}