import Link from 'next/link';
import dynamic from 'next/dynamic';
import styles from '@/styles/Card.module.css'

const {Card, Badge, Row, Col} = require('react-bootstrap');
const UsernameAndAvatar = dynamic(() => import('../usernameAndAvatar'))
const Reactions = dynamic(() => import('./reactions'))

export default function ReviewCard({ review }) { 
    const rating = review.rating
    var badgeVariant = 'danger'

    if (rating > 6) {
        badgeVariant = 'success'
    } else if (rating > 3) {
        badgeVariant = 'warning'
    }

    return(
        <>
            <Card className='mx-1 my-1'>
                <Link href={'/reviews/' + review.id} passHref legacyBehavior>
                    <Card.Img variant='top' src='/temppics/androidparty.png' className={styles.image} />
                </Link>
                <Card.Body>
                    <Link href={'/reviews/' + review.id} passHref legacyBehavior>
                        <div className={styles.header}>
                            <Badge bg={badgeVariant}>{review.rating}/10</Badge>
                            <Card.Title className='mt-2'>
                                {review.header}
                            </Card.Title>
                        </div>
                    </Link>   
                    <Card.Subtitle>{review.work}</Card.Subtitle>
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
                    {review.tags.map((name, id) => (
                        <Badge bg='info' className='mx-1' key={id}>{name}</Badge>
                    ))}
                </Card.Footer>
            </Card>
        </>
    )
}