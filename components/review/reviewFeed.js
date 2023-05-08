import dynamic from 'next/dynamic';

const { Row, Col} = require('react-bootstrap');

const ReviewCard = dynamic(() => import('./reviewCard'));

export default function reviewFeed({ reviews, fix}) {
    if (reviews.length > 0) {
        if (fix) {
            return(
                <Row xs={1} sm={fix} className='my-2 pe-0'>
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
    return(
        <Row>
            <Col>
                <h1 className='text-center text-muted'>Empty!</h1>
                <h3 className='text-center text-muted'>We have not found any reviews here</h3>
            </Col>
        </Row>
    )
}