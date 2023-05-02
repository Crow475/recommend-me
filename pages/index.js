import Link from 'next/link';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';

import prisma from '@/lib/prisma';
import formatCreationDate from '@/lib/formatCreationDate';

import { ArrowRight } from 'react-bootstrap-icons';

const { Container, Row } = require('react-bootstrap');

const Footer = dynamic(() => import('../components/footer'));
const ReviewFeed = dynamic(() => import('../components/review/reviewFeed'))
const SignInBanner = dynamic(() => import('../components/signInBanner'))

// const inter = Inter({ subsets: ['latin'] });

export default function Home(props) {
  return (
    <>
      <Head>
        <title>RecommendMe - Home</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <Container fluid>
          {/* <Row className='my-2'>
            <h1 className='text-center'>Explore</h1>
          </Row> */}
          <h1 className='my-2'>Home</h1>
          <Row className='my-2'>
            <Link href='/top'>
              <h2>Top reviews <ArrowRight size={30} className='align-middle'/></h2>
            </Link>
          </Row>
          <ReviewFeed reviews={props.top} />
          <hr />
          <Row className='my-2'>
            <Link href='/latest'>
              <h2> Latest reviews <ArrowRight size={30} className='align-middle'/></h2>
            </Link>
          </Row>
          <ReviewFeed reviews={props.latest}/>
        </Container>
        <Footer/>
      </main>
    </>
  )
}

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

}
