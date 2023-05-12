import Head from 'next/head';
import prisma from '@/lib/prisma';
import dynamic from 'next/dynamic';
import formatCreationDate from '@/lib/formatCreationDate';

import { useEffect, useState } from "react";

const { Container, Row } = require('react-bootstrap');

const Footer = dynamic(() => import('../components/footer'));
const ScrollToTop = dynamic(() => import('../components/scrollToTop'));
const ReviewFeed = dynamic(() => import('../components/review/reviewFeed'));

export const getServerSideProps = async () => {
    let feed = await prisma.review.findMany({
        where: {
            published: true
        },
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
          likedBy: true,
          dislikedBy: true,
          _count: {
            select: { comments: true }
          }
        },
    });

    feed.map(review => {formatCreationDate(review)});

    return {
        props: { feed }
    }
};

export default function Latest(props) {
    const [showBackButton, setShowBackButton] = useState(false);

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
                <title>RecommendMe - Latest</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main>
                <Container fluid>
                    <Row className='my-2'>
                        <h1>Latest reviews</h1>
                    </Row>
                    <Row className='mx-2'>
                        <p>Hidden gems? Controversial oppinions? Find them here first!</p>
                    </Row>
                    <ReviewFeed reviews={props.feed}/>
                </Container>
                {showBackButton? <ScrollToTop/> : null}
                <Footer/>
            </main>
        </>
    );
};
