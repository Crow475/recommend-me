import Link from 'next/link';
import Head from 'next/head';
import prisma from '@/lib/prisma';
import dynamic from 'next/dynamic';
import styles from '@/styles/Home.module.css';
import formatCreationDate from '@/lib/formatCreationDate';

import { ArrowRight } from 'react-bootstrap-icons';

const { Container, Row } = require('react-bootstrap');

const Footer = dynamic(() => import('../components/footer'));
const ReviewFeed = dynamic(() => import('../components/review/reviewFeed'));


export const getServerSideProps = async () => {
  let latest = await prisma.review.findMany({
    where: {
      published: true
    },
    take: 4,
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
    orderBy: [{
      creationDate: 'desc',
    },],
  });

  let top = await prisma.review.findMany({
    where: {
      published: true
    },
    take: 4,
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
    orderBy: {
      likedBy: {
        _count: 'desc'
      }
    }
  })

  top.map(review => {formatCreationDate(review)})
  latest.map(review => {formatCreationDate(review)})

  return {
    props: { latest, top }
  }
};

export default function Home(props) {
  return (
    <>
      <Head>
        <title>RecommendMe - Home</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <Container fluid>
          <h1 className='my-2'>Home</h1>
          <Row className='my-2'>
            <Link href='/top'>
              <h2 className={styles.link}>
                <span>Top reviews</span> 
                <ArrowRight size={30} className='align-middle'/>
              </h2>
            </Link>
          </Row>
          <ReviewFeed reviews={props.top} />
          <hr />
          <Row className='my-2'>
            <Link href='/latest'>
              <h2 className={styles.link}>
                <span>Latest reviews</span>
                <ArrowRight size={30} className='align-middle'/>
              </h2>
            </Link>
          </Row>
          <ReviewFeed reviews={props.latest}/>
        </Container>
        <Footer/>
      </main>
    </>
  )
}

