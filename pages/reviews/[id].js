import dynamic from 'next/dynamic';
import Head from 'next/head';
import prisma from '@/lib/prisma';
import formatCreationDate from '@/lib/formatCreationDate';
import styles from '@/styles/Review.module.css'
import { useRouter } from 'next/router';

import { InfoCircleFill, X, XLg } from 'react-bootstrap-icons';

const {Card, Badge, Row, Col, Container, Accordion, Image, Button} = require('react-bootstrap');

const UsernameAndAvatar = dynamic(() => import('../../components/usernameAndAvatar'));
const Reactions = dynamic(() => import('../../components/review/reactions'));
const CommentForm = dynamic(() => import('../../components/review/commentForm'));
const Comment = dynamic(() => import('../../components/review/comment'));

export const getServerSideProps = async ({ params }) => {
    let review = await prisma.review.findUnique({
        where: {
            id: params?.id
        },
        include: {
            author: {
                include: {
                  user: true
                }
            },
            likedBy: true,
            dislikedBy: true,
            comments: {
                orderBy: [{
                    creationDate: 'desc',
                },],
                include: {
                    author: {
                        include: {
                            user: true
                        }
                    }
                }
            },
            _count: {
                select: { comments: true }
            }
        },
    })

    review = formatCreationDate(review)
    review.comments.map( comment => {formatCreationDate(comment)})

    return {
        props: review
    }
}

const ReviewPage = (props) => {
    const rating = props.rating;
    var badgeVariant = 'danger';
    const router = useRouter()

    if (rating > 6) {
        badgeVariant = 'success'
    } else if (rating > 3) {
        badgeVariant = 'warning'
    }

    const title = "RecommendMe: " + props.header

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main>
                <Container fluid>
                    <Row className='my-2'>
                        <Col xs={9} lg={10} xl={11}>
                            <h1><Badge bg={badgeVariant}>{props.rating}/10</Badge> {props.header}</h1>
                        </Col>
                        <Col xs={3} lg={2} xl={1}>
                            <Button className='my-2' onClick={() => router.back()}><XLg size={25}/> Close</Button>
                        </Col>
                    </Row>
                    <Row className='my-2'>
                        <Col lg={3}>
                            <Accordion defaultActiveKey='0' className='my-2'>
                                <Accordion.Item eventKey='0'>
                                    <Accordion.Header>
                                        <InfoCircleFill size={20} className='mx-2'/> Info
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <Row>
                                            <Col xs={9}>
                                                <h5>{props.header}</h5>
                                            </Col>
                                            <Col xs={3}>
                                                <Badge bg={badgeVariant}>{props.rating}/10</Badge>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <h6>{props.work}</h6>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={6}>
                                                <UsernameAndAvatar username={props.author.user.name} avatar={props.author.user.image}/>
                                            </Col>
                                            <Col xs={6}>
                                                {props.creationDate}
                                            </Col>
                                        </Row>
                                        <hr/>
                                        {props.tags.map((name, id) => (
                                            <Badge bg='info' className='mx-1' key={id}>{name}</Badge>
                                        ))}
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                            <Reactions review={props}/>
                        </Col>
                        <Col xs={12} lg={8} className={styles.content}>
                            <Card>
                                <Card.Header>
                                    <div className={styles.image}>
                                        <Image src='/temppics/gavryl-2.jpg' alt='review pic' thumbnail fluid />
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <p>{props.content}</p>
                                    <hr id='comment-section'/>
                                    <CommentForm review={props}/>
                                    <h4>Comments ({props._count.comments})</h4>
                                    {props.comments.map((element, id) => {
                                        return(
                                            <Comment comment={element} key={id}/>
                                        )
                                    })}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </main>
        </>
    )
}

export default ReviewPage
