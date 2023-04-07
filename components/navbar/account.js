import 'bootstrap/dist/css/bootstrap.min.css';

const {Button, ButtonToolbar} = require('react-bootstrap');

export default function account() {
    return(
        <ButtonToolbar className='my-1 mx-2'>
            <Button size='me' variant='secondary'>Log in</Button>
            <Button size='me' variant='primary' className='hidden-sm'>Sign up</Button>
        </ButtonToolbar>
    )
}