import Head from 'next/head';
import prisma from '@/lib/prisma';
import dynamic from 'next/dynamic';
import styles from '@/styles/Account.module.css';
import formatCreationDate from '@/lib/formatCreationDate';

import { Journals, CheckLg, HandThumbsUpFill, HandThumbsDownFill, PencilFill, PersonCircle } from 'react-bootstrap-icons';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react";

const {Card, Badge, Row, Col, Container, Image, Button, ButtonGroup} = require('react-bootstrap');


const ReviewFeed = dynamic(() => import('../../components/review/reviewFeed'))
const ScrollToTop = dynamic(() => import('../../components/scrollToTop'));

export async function getServerSideProps(context) {
    let session = await getServerSession(context.req, context.res, authOptions)

    let published = await prisma.review.findMany({
        where: {
            author: {
                id: context.params.id
            },
            published: true
        },
        include: {
            author: {
                include: {
                  user: true
                }
            },
            likedBy: true,
            dislikedBy: true,
            _count: {
                select: { 
                    comments: true,
                    likedBy: true,
                    dislikedBy: true
                }
            }
        },
        orderBy: [{
        creationDate: 'desc',
        },],
    })
    published.map(review => {formatCreationDate(review)});

    let profile = await prisma.profile.findUnique({
        where: {
            id: context.params.id
        },
        include: {
            user: {
                select: {
                    name: true
                }
            },
            _count: {
                select: {
                    comments: true,
                    likedReviews: true,
                    dislikedReviews: true
                }
            }
        }
    })

    let reviewCount = await prisma.review.count({
        where: {
            authorId: context.params.id
        }
    })

    if (session && session.user.profile.id === context.params.id) {
        let drafts = await prisma.review.findMany({
            where: {
                author: {
                    id: session.user.profile.id
                },
                published: false
            },
            include: {
                author: {
                    include: {
                      user: true
                    }
                },
                likedBy: true,
                dislikedBy: true,
                _count: {
                  select: { comments: true }
                }
            },
            orderBy: [{
            creationDate: 'desc',
            },],
        })
        drafts.map(review => {formatCreationDate(review)});

        let liked = await prisma.review.findMany({
            where: {
                likedBy: {
                    some: {
                        id: session.user.profile.id
                    }
                },
                published: true
            },
            include: {
                author: {
                    include: {
                      user: true
                    }
                },
                likedBy: true,
                dislikedBy: true,
                _count: {
                    select: { 
                        comments: true 
                    }
                }
            },
        })
        liked.map(review => {formatCreationDate(review)});

        let disliked = await prisma.review.findMany({
            where: {
                dislikedBy: {
                    some: {
                        id: session.user.profile.id
                    }
                },
                published: true
            },
            include: {
                author: {
                    include: {
                      user: true
                    }
                },
                likedBy: true,
                dislikedBy: true,
                _count: {
                  select: { comments: true }
                }
            },
        })
        disliked.map(review => {formatCreationDate(review)});

        return{
            props: {published, drafts, liked, disliked, profile, reviewCount}    
        }
    }

    return{
        props: {published, profile, reviewCount}
    }

}

export default function ProfilePage(props) {
    const { data: session } = useSession();
    const [showBackButton, setShowBackButton] = useState(false);
    const [currentTab, setCurrentTab] = useState("published")

    useEffect(() => {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                setShowBackButton(true)
            } else {
                setShowBackButton(false)
            }
        });
    }, []);

    const title = `RecommendMe: ${props.profile.user.name}`
    var userRating = 0

    props.published.map((review) => {
        userRating = userRating + review._count.likedBy - review._count.dislikedBy
    })

    const tabs = [
        {value: "published", label: "Reviews", logo: <CheckLg className='mx-1'/>},
        {value: "drafts", label: "Drafts", logo: <Journals className='mx-1'/>},
        {value: "liked", label: "Liked", logo: <HandThumbsUpFill className='mx-1'/>},
        {value: "disliked", label: "Disliked", logo: <HandThumbsDownFill className='mx-1'/>},
    ]

    function TabButton({label, value, logo, className}) {
        return(
            <Button size='lg' 
                variant={(currentTab === value)?"primary":"light"}
                onClick={() => setCurrentTab(value)}
                className={className}
            >
                {logo}
                <span> {label}</span>
            </Button>
        )
    }

    function TopTabs() {
        if (session && session.user.profile.id === props.profile.id) {
            return(
                <Row className='my-2'>
                    <ButtonGroup>
                        {tabs.map((element, id) => {
                            return(
                                <TabButton label={element.label} value={element.value} logo={element.logo} key={id}/>
                            )
                        })}
                    </ButtonGroup>
                </Row>
            )
        }
    }
    
    function SideTabs() {
        if (session && session.user.profile.id === props.profile.id) {
            return(
                <>
                    {tabs.map((element, id) => {
                        return(
                            <Row className='my-1 mx-1' key={id}>
                                <TabButton label={element.label} value={element.value} logo={element.logo} className='d-flex justify-content-start align-items-center'/>
                            </Row>
                        )
                    })}
                </>
            )
        }
    }

    function ProfileContent() {
        return(
            <>
                <h2>{tabs.find(element => {return (element.value === currentTab)}).label}</h2>
                <ReviewFeed reviews={props[currentTab]} fix={2}/>
            </>
        )
    }

    function Avatar() {
        if (props.profile.image) {
            return(
                <Image src={props.profile.image} alt='user avatar' roundedCircle className={styles.avatar_big}/>
            )
        }
        return(
            <PersonCircle size={130} className='my-1'/>
        )
    }

    function EditButton() {
        if (session && session.user.profile.id === props.profile.id) {
            return(
                <Row className='mx-1 mt-3'>
                    <Button variant='secondary'><PencilFill/><span> Edit profile</span></Button>
                </Row>
            )
        }
    }
    
    return(
        <>
            <Head>
                <title>{title}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main>
                <Container fluid>
                    <Row className='my-2'>
                        <h1>{props.profile.user.name}`s profile</h1>
                    </Row>
                    <Row className='my-2'>
                        <Col xs={12} lg={3}>
                            <Card>
                                <Card.Body>
                                    <Row className='mx-1'>
                                        <Col>
                                            <Avatar/>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={8} >
                                            <h4 className='my-2'>{props.profile.user.name}</h4>
                                        </Col>
                                        <Col xs={4} className='align-self-center'>
                                            <Badge><span className='h5'>{userRating}</span></Badge>
                                        </Col>
                                    </Row>
                                    <Row className='mx-2'>
                                        <hr/>
                                    </Row>
                                    <Row className='mx-1'>
                                        <p>{props.profile.bio}</p>
                                    </Row>
                                    <Row>
                                        <span>Stats</span>
                                        <Row className='mx-1'>
                                            <Col xs={7}>
                                                <span>Reviews: </span>
                                            </Col>
                                            <Col xs={4}>
                                                <Badge bg='info'>{props.reviewCount}</Badge>
                                            </Col>
                                        </Row>
                                        <Row className='mx-1'>
                                            <Col xs={7}>
                                                <span>Comments: </span>
                                            </Col>
                                            <Col xs={4}>
                                                <Badge bg='info'>{props.profile._count.comments}</Badge>
                                            </Col>
                                        </Row>
                                        <Row className='mx-1'>
                                            <Col xs={7}>
                                                <span>Likes: </span>
                                            </Col>
                                            <Col xs={4}>
                                                <Badge bg='info'>{props.profile._count.likedReviews}</Badge>
                                            </Col>
                                        </Row>
                                        <Row className='mx-1'>
                                            <Col xs={7}>
                                                <span>Dislikes: </span>
                                            </Col>
                                            <Col xs={4}>
                                                <Badge bg='info'>{props.profile._count.dislikedReviews}</Badge>
                                            </Col>
                                        </Row>
                                        <EditButton />
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} lg={7}>
                            <Row className='d-xs-block d-lg-none'>
                                <TopTabs />
                            </Row>
                            <Row>
                                <ProfileContent/>
                            </Row>
                        </Col>
                        <Col lg={2} className='d-none d-lg-block'>
                            <SideTabs />
                        </Col>
                    </Row>
                    {showBackButton?<ScrollToTop/>:null}
                </Container>
            </main>
        </>
    )
}