import dynamic from 'next/dynamic';

const { Row, Col, Button} = require('react-bootstrap');

const ReviewCard = dynamic(() => import('./reviewCard'));

export default function reviewFeed({ reviews}) {
    return(
        <Row xs={1} sm={2} md={2} lg={3} xl={4} className='my-2'>
            {reviews.map((element, id) => {
                return(
                    <Col key={id}>
                        <ReviewCard review={element}/>
                    </Col>
                )
            })}
        </Row>
    )
}