import dynamic from 'next/dynamic';
import Head from 'next/head';
import prisma from '@/lib/prisma';
import formatCreationDate from '@/lib/formatCreationDate';
import styles from '@/styles/Review.module.css'
import { useRouter } from 'next/router';

import { InfoCircleFill, X, XLg } from 'react-bootstrap-icons';

const {Card, Badge, Row, Col, Container, Accordion, Image, Button} = require('react-bootstrap');

const CommentForm = dynamic(() => import('../../components/review/commentForm'));
const RatingBadge = dynamic(() => import('../../components/review/ratingBadge'));
const Reactions = dynamic(() => import('../../components/review/reactions'));
const ProfileLink = dynamic(() => import('../../components/profileLink'));
const Comment = dynamic(() => import('../../components/review/comment'));

export const getServerSideProps = async ({ params }) => {
    let review = await prisma.review.findUnique({
        where: {
            id: params?.id
        },
        include: {
            author: {
                include: {
                  user: {
                    select: {
                        name: true
                    }
                  }
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
                            user: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    },
                    review: {
                        include: {
                            author: true
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
    review.comments.map( comment => {formatCreationDate(comment.review)})

    return {
        props: review
    }
}

const ReviewPage = (props) => {
    const router = useRouter()
    const title = "RecommendMe: " + props.header

    function ReviewImage() {
        if (props.image) {
            return(
                <Card.Header>
                    <div className={styles.image}>
                        <Image src={props.image} alt='review pic' thumbnail fluid />
                    </div>
                </Card.Header>
            )
        }
    }

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main>
                <Container fluid>
                    <Row className='my-2'>
                        <Col xs={10} xxl={11}>
                            <h1><RatingBadge rating={props.rating}/> {props.header}</h1>
                        </Col>
                        <Col xs={2} xxl={1}>
                            <Button className='my-2' onClick={() => router.back()}>
                                <XLg size={25}/> 
                                <span className='d-none d-md-inline'> Close</span>
                            </Button>
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
                                                <RatingBadge rating={props.rating}/>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <span>{props.work}</span>
                                        </Row>
                                        <Row>
                                            <Col xs={4}>
                                                <Badge bg='success'>{props.category}</Badge>
                                            </Col>
                                        </Row>
                                        <Row className='mt-2'>
                                            <Col xs={6}>
                                                <ProfileLink profile={props.author}/>
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
                                <ReviewImage />
                                <Card.Body>
                                    <p>{props.content}</p>
                                    <hr />
                                    <div id='comment-section'/>
                                    <CommentForm review={props} />
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
