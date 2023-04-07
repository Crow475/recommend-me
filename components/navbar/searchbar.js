import 'bootstrap/dist/css/bootstrap.min.css';
import { Search } from 'react-bootstrap-icons';

const { InputGroup, Button, Form, Row, Col } = require('react-bootstrap');

export default function SearchBar() {
    return(
        <Form className='my-1 mx-2'>
            <InputGroup>
                <Form.Control placeholder='Search for reviews'/>
                <Button variant='secondary' type='submit'><Search className='align-middle' /></Button>
            </InputGroup>
        </Form>
    )
}