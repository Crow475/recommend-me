import Head from 'next/head';
import prisma from '@/lib/prisma';
import dynamic from 'next/dynamic';
import CheckAccess from '@/lib/checkAccess';
import styles from '@/styles/Review.module.css';
import formatCreationDate from '@/lib/formatCreationDate';

import { useRouter } from 'next/router';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]";

import { InfoCircleFill, XLg } from 'react-bootstrap-icons';

const {Card, Badge, Row, Col, Container, Accordion, Image, Button} = require('react-bootstrap');

const Comment = dynamic(() => import('../../../components/review/comment'));
const Reactions = dynamic(() => import('../../../components/review/reactions'));
const ReviewText = dynamic(() => import('../../../components/review/reviewText'));
const CommentForm = dynamic(() => import('../../../components/review/commentForm'));
const RatingBadge = dynamic(() => import('../../../components/review/ratingBadge'));
const ProfileLink = dynamic(() => import('../../../components/profile/profileLink'));
const NotSignedIn = dynamic(() => import('../../../components/banners/notSignedIn'));
const WrongAccount = dynamic(() => import('../../../components/banners/wrongAccount'));

export async function getServerSideProps(context) {
    let session = await getServerSession(context.req, context.res, authOptions)

    let review = await prisma.review.findUnique({
        where: {
            id: context.params?.id
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

    if (!review) {
        return{
            notFound: true
        }
    }

    const error = {code: null};

    if (!review.published) {
        if (!session) {
            error.code = "notSignedIn"
            return {
                props: error
            }
        } else if (!CheckAccess(review.author, session)) {
            error.code = "notAuthor"
            return {
                props: error
            }
        }
    };

    review = formatCreationDate(review);
    review.comments.map( comment => {formatCreationDate(comment)});
    review.comments.map( comment => {formatCreationDate(comment.review)});

    return {
        props: review
    };
}

const ReviewPage = (props) => {
    const router = useRouter()
    const title = "RecommendMe: " + props.header

    if (props.code) {
        if (props.code === "notSignedIn") {
            return(
                <NotSignedIn text="You need to be signed in to view your drafts"/>
            )
        }
        if (props.code === "notAuthor") {
            return(
                <WrongAccount text="You cannot view other users' drafts" />
            )
        }
    }

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

    function CommentSection() {
        if (props.published) {
            return(
                <>
                    <hr />
                    <div id='comment-section'/>
                    <CommentForm review={props} />
                    <h4>Comments ({props._count.comments})</h4>
                    {props.comments.map((element, id) => {
                        return(
                            <Comment comment={element} key={id}/>
                        )
                    })}
                </>
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
                                <span className='d-none d-md-inline align-text-top'> Close</span>
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
                                    <ReviewText text={props.content} />
                                    <CommentSection />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </main>
        </>
    );
};

export default ReviewPage;
