import Link from 'next/link';
import { HandThumbsUp, HandThumbsDown, ChatDots, PersonCircle} from 'react-bootstrap-icons';

import 'bootstrap/dist/css/bootstrap.min.css';

const {Card, Button, Badge, ButtonToolbar, ButtonGroup, Row, Col} = require('react-bootstrap');

export default function reviewCard() {
    return(
        <Card className='mx-1 my-1'>
            <Card.Img variant='top' src='/temppics/androidparty.png'/>
            <Card.Body>
                <Badge>10/10</Badge>
                <Card.Title className='mt-2'>Test Card Test Card</Card.Title>
                <Card.Subtitle>Name of the artwork</Card.Subtitle>
                <hr />
                <Card.Text>
                    Lorem ipsum dolor test card test card
                    Lorem ipsum dolor test card test
                    Lorem ipsum dolor test card test
                    Lorem ipsum dolor test card test
                </Card.Text>
                <Row>
                    <Col lg={6} xs={6}>
                        <p><PersonCircle className='align-text-top' size={20}/> Author</p>
                    </Col>
                    <Col lg={6} xs={6}>
                        <p className="text-end">13/02/2022</p>
                    </Col>
                </Row>
                <ButtonToolbar>
                    <ButtonGroup className='mx-1 my-1'>
                        <Button variant='secondary' disabled>+69</Button>
                        <Button variant='success'><HandThumbsUp size={22}/></Button>
                        <Button variant='danger'><HandThumbsDown size={22}/></Button>
                    </ButtonGroup>
                    <ButtonGroup className='mx-2 my-1'>
                        <Button variant='secondary' disabled>42</Button>
                        <Button variant='secondary'><ChatDots size={18}/></Button>
                    </ButtonGroup>
                </ButtonToolbar>
            </Card.Body>
            <Card.Footer>
                <Badge bg='info' className='mx-1'>Movie</Badge>
                <Badge bg='info' className='mx-1'>Comedy</Badge>
            </Card.Footer>
        </Card>
    )
}