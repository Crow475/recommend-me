import Link from 'next/link';
import { HandThumbsUp, HandThumbsDown, ChatDots, PersonCircle, StarFill, Star } from 'react-bootstrap-icons';

import 'bootstrap/dist/css/bootstrap.min.css';

const {Card, Button, ButtonToolbar, ButtonGroup, Row, Col} = require('react-bootstrap');

export default function reviewCard() {
    return(
        <Card className='mx-1 my-1'>
            <Card.Img variant='top' src='/temppics/androidparty.png'/>
            <Card.Body>
                {Array.from({ length: 5}).map((_, id) => (<StarFill color='orange' key={id} size={18}/>))}
                <Card.Title className='mt-2'>Test Card Test Card</Card.Title>
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
                        <Button variant='secondary' disabled>42</Button>
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

            </Card.Footer>
        </Card>
    )
}