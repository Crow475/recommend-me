import Link from 'next/link';
import dynamic from 'next/dynamic';
import styles from '@/styles/Card.module.css'

const {Card, Badge, Row, Col} = require('react-bootstrap');
const UsernameAndAvatar = dynamic(() => import('../usernameAndAvatar'))
const Reactions = dynamic(() => import('./reactions'))
const RatingBadge = dynamic(() => import('./ratingBadge'))

export default function ReviewCard({ review }) { 
    return(
        <>
            <Card className='mx-1 my-1'>
                <Link href={'/reviews/' + review.id} passHref legacyBehavior>
                    <Card.Img variant='top' src={review.image} className={styles.image} />
                </Link>
                <Card.Body>
                    <Link href={'/reviews/' + review.id} passHref legacyBehavior>
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
                    <Card.Text>
                        {review.content.slice(0, 120)}...
                    </Card.Text>
                    <Row>
                        <Col lg={6} xs={6}>
                            <UsernameAndAvatar username={review.author.user.name} avatar={review.author.user.image} />
                        </Col>
                        <Col lg={6} xs={6}>
                            <p className="text-end">{review.creationDate}</p>
                        </Col>
                    </Row>
                    <Reactions review={review} />
                </Card.Body>
                <Card.Footer>
                    <Badge bg='success'>{review.category}</Badge>
                    <span>{(review.tags.length > 0)?" |":""}</span>
                    {review.tags.map((name, id) => (
                        <Badge bg='info' className='mx-1' key={id}>{name}</Badge>
                    ))}
                </Card.Footer>
            </Card>
        </>
    )
}