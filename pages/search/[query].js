import Head from 'next/head';
import prisma from '@/lib/prisma';
import dynamic from 'next/dynamic';
import formatCreationDate from '@/lib/formatCreationDate';

import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const ReviewFeed = dynamic(() => import('../../components/review/reviewFeed'));
const ScrollToTop = dynamic(() => import('../../components/scrollToTop'));
const SearchBar = dynamic(() => import('../../components/navbar/searchbar'))

export async function getServerSideProps(context) {
    const query = context.query.query
    const order = context.query.Order

    const orderMethod = {
        relevant: {orderBy: {_relevance: {fields: ['header', 'work', 'content',], search: context.query.Search, sort: 'desc'}}},
        newest: {orderBy: [{creationDate: 'desc'}],},
        oldest: {orderBy: [{creationDate: 'asc'}],},
        liked: {orderBy: [{likedBy: {_count: 'desc'}}],},
        disliked: {orderBy: [{dislikedBy: {_count: 'desc'}}]}
    }
    
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
                published: true
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
        props: { found, query, order }
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
    
    return(
        <>
            <Head>
                <title>{title}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Container fluid>
                <Row className='my-2'>
                    <h1>Search</h1>
                </Row>
                <Row className='mb-2 mx-2'>
                    <SearchBar full={true} defaultValue={props.query} defaultOrder={props.order}/>
                </Row>
                <Row className='my-2'>
                    <h2>{`Results for "${props.query}" (${props.found.length})`}</h2>
                </Row>
                <Row>
                    <ReviewFeed reviews={props.found}/>
                </Row>
                {showBackButton?<ScrollToTop />:null}
            </Container>
        </>
    )
}