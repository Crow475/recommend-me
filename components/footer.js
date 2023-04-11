import 'bootstrap/dist/css/bootstrap.min.css';

const {Row, Col, Container} = require('react-bootstrap');

export default function Footer() {
    return(
        <Container fluid className='bg-light mt-3'>
            <br/>
            <Row>
                <Col lg={{span: 4, offset: 4}}>
                    <h5 className='text-center text-secondary'>Recommend.me</h5>
                    <br/>
                    <p className='text-center text-secondary'>2023 Recommend-me.co</p>
                    <p className='text-center text-secondary'>All Rights Reserved</p>
                </Col>
            </Row>
        </Container>
    );
}