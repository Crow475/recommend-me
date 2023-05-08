import Link from 'next/link';
import dynamic from 'next/dynamic';
import styles from '@/styles/Card.module.css'
import ReadableCategory from '@/lib/readableCategory';

const {Card, Badge, Row, Col} = require('react-bootstrap');

const ProfileLink = dynamic(() => import('../profile/profileLink'))
const Reactions = dynamic(() => import('./reactions'))
const RatingBadge = dynamic(() => import('./ratingBadge'))
const ReviewCardText = dynamic(() => import('./reviewCardText'))

export default function ReviewCard({ review }) { 
    const reviewLink = `/reviews/${review.id}`
    
    return(
        <>
            <Card className='mx-1 my-1'>
                <Link href={reviewLink} passHref legacyBehavior>
                    <Card.Img variant='top' src={review.image} className={styles.image}/>
                </Link>
                <Card.Body>
                    <Link href={reviewLink} passHref legacyBehavior>
                        <div className={styles.header}>
                            <Card.Title>
                                <RatingBadge rating={review.rating}/>
                                <span> </span>
                                {(review.header.length > 60)?review.header.slice(0, 60) + "...":review.header}
                            </Card.Title>
                            <Card.Subtitle>
                                {review.work}
                            </Card.Subtitle>
                        </div>
                    </Link>   
                    <hr />
                    <Link href={reviewLink + "#text"} passHref className={styles.text_link}>
                        <ReviewCardText text={review.content} />
                    </Link>
                    <Row>
                        <Col lg={6} xs={6}>
                            <ProfileLink profile={review.author} />
                        </Col>
                        <Col lg={6} xs={6}>
                            <p className="text-end">{review.creationDate}</p>
                        </Col>
                    </Row>
                    <Reactions review={review} />
                </Card.Body>
                <Card.Footer>
                    <Badge bg='success'>{ReadableCategory(review.category)}</Badge>
                    <span>{(review.tags.length > 0)?" |":""}</span>
                    {review.tags.map((name, id) => (
                        <Badge bg='info' className='mx-1' key={id}>{name}</Badge>
                    ))}
                </Card.Footer>
            </Card>
        </>
    )
}