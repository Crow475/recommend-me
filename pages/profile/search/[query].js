import Head from 'next/head';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import dynamic from 'next/dynamic';
import formatCreationDate from '@/lib/formatCreationDate';

import { Category } from '@prisma/client';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { ChevronLeft } from 'react-bootstrap-icons';

const ReviewFeed = dynamic(() => import('../../../components/review/reviewFeed'));
const ScrollToTop = dynamic(() => import('../../../components/scrollToTop'));
const SearchBar = dynamic(() => import('../../../components/navbar/searchbar'))
const ProfileCard = dynamic(() => import('../../../components/profile/profileCard'))

export async function getServerSideProps(context) {
    const query = context.query.query
    const profileId = context.query.Profile
    const order = context.query.Order
    const category = context.query.Category

    const orderMethod = {
        relevant: {orderBy: {_relevance: {fields: ['header', 'work', 'content',], search: context.query.Search, sort: 'desc'}}},
        newest: {orderBy: [{creationDate: 'desc'}],},
        oldest: {orderBy: [{creationDate: 'asc'}],},
        liked: {orderBy: [{likedBy: {_count: 'desc'}}],},
        disliked: {orderBy: [{dislikedBy: {_count: 'desc'}}]}
    }

    function CategoryFilter(category) {
        if (category === "any") {
            return null
        }
        return(
            {category: Category[category]}
        )
    }
    
    let profile = await prisma.profile.findUnique({
        where: {
            id: profileId
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
    })

    published.map(review => {formatCreationDate(review)});
    
    let found = await prisma.review.findMany({
        where: {
            OR: [
                {
                    content: {
                        search: context.query.Search
                    }
                },
                {
                    header: {
                        search: context.query.Search
                    }
                },
                {
                    work: {
                        search: context.query.Search
                    }
                },
                {
                    comments: {
                        some: {
                            content: {
                                search: context.query.Search
                            }
                        }
                    }
                },
            ],
            AND: {
                published: true,
                authorId: profileId,
                ...CategoryFilter(category)
            }
        },
        ...orderMethod[order],
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
            _count: {
              select: { comments: true }
            }
        },
    })

    found.map(review => {formatCreationDate(review)});

    return{
        props: { found, query, order, category, profile, published }
    }
}

export default function Search(props) {
    const [showBackButton, setShowBackButton] = useState(false);
    const title = `RecommendMe - Search: ${props.query}`

    useEffect(() => {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                setShowBackButton(true)
            } else {
                setShowBackButton(false)
            }
        });
    }, []);

    function BackToProfile() {
        return(
            <Link href={`/profile/${props.profile.id}`} passHref legacyBehavior>
                <Button 
                    className='d-flex justify-content-start align-items-center'
                    variant='light' 
                    size='lg'
                >
                    <ChevronLeft className='mx-1'/>
                    Back
                </Button>
            </Link>
        )
    }
    
    return(
        <>
            <Head>
                <title>{title}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Container fluid>
                <Row className='my-2'>
                    <h1>{`Search ${props.profile.user.name}'s reviews`}</h1>
                </Row>
                <Row>        
                    <Col xs={12} lg={3}>
                        <ProfileCard profile={props.profile} published={props.published}/>
                    </Col>
                    <Col xs={12} lg={7}>
                        <Row className='d-xs-block d-lg-none mt-2 mx-1'>
                            <BackToProfile />
                        </Row>
                        <Row className='my-2 mx-2'>
                            <SearchBar profile={props.profile} label={`Search ${props.profile.user.name}'s reviews`} full={true} defaultValue={props.query} defaultOrder={props.order} defaultCategory={props.category}/>
                        </Row>
                        <Row className='my-2'>
                            <h2>{`Results for "${props.query}" (${props.found.length})`}</h2>
                        </Row>
                        <Row>
                            <ReviewFeed reviews={props.found} fix={2}/>
                        </Row>
                    </Col>
                    <Col lg={2} className='d-none d-lg-block'>
                        <Row className='my-1 mx-1'>
                            <BackToProfile />
                        </Row>
                    </Col>
                </Row>
                {showBackButton?<ScrollToTop />:null}
            </Container>
        </>
    )
}