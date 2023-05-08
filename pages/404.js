import Link from 'next/link'
const {Row, Col, Container, Button } = require('react-bootstrap');

export default function PageNotFound() {
    return(
        <Container fluid>
            <Row className='mt-4'>
                <Col xs={{span: 6, offset: 2}}>
                    <h1 className='display-1'>404</h1>
                </Col>
            </Row>
            <Row>
                <hr/>
            </Row>
            <Row>
                <Col xs={{span: 6, offset: 2}}>
                    <h1>Page not found</h1>
                </Col>
            </Row>
            <Row className='my-2'>
                <Col xs={{span: 8, offset: 2}}>
                    <p><strong>Ooops!</strong> It looks like the page you are looking for does not exist</p>
                </Col>
            </Row>
            <Row className='mt-5'>
                <Col xs={{span: 6, offset: 2}}>
                    <Link href="/" passHref legacyBehavior>
                        <Button size='lg'>Go back home</Button>
                    </Link>
                </Col>
            </Row>
        </Container>
    )
}