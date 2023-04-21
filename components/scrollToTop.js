import { CaretUpFill } from "react-bootstrap-icons"

const { Container, Row, Col, Button} = require('react-bootstrap');

export default function ScrollToTop() {
    const backToTop = () =>{
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    
    return(
        <Container  className="sticky-bottom" fluid>
            <Row className='justify-content-end'>
                <Col lg={1} sm={1}>
                    <Button onClick={backToTop} className='my-3'><CaretUpFill size={30}/></Button>
                </Col>
            </Row>
        </Container>
    )
}