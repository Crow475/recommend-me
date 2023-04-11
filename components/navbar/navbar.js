import 'bootstrap/dist/css/bootstrap.min.css';

import styles from '@/styles/Navbar.module.css'
import Link from 'next/link'
import dynamic from 'next/dynamic';

const {Container, Nav, Navbar, NavbarBrand, Row, Col} = require('react-bootstrap');
const SessionControl = dynamic(() => import('./sessionControl'))
const Search = dynamic(() => import('./searchbar'))

export default function NavBar() {
    return(
        <Navbar bg='light' variant='light' collapseOnSelect expand='lg' sticky='top' className={styles.navbar}>
            <Link href='/' className={styles.brand} passHref>
                <NavbarBrand className={styles.brand}>Recommend.me</NavbarBrand>
            </Link>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Container fluid>
                <Navbar.Collapse id='responsive-navbar-nav' className='justify-content-start'>
                    <Nav>
                        <Link href='/' passHref className={styles.link}>
                            <Nav.Link as='span'>Home</Nav.Link>
                        </Link>
                        <Link href='/' passHref className={styles.link}>
                            <Nav.Link as='span'>Top</Nav.Link>
                        </Link>
                        <Link href='/' passHref className={styles.link}>
                            <Nav.Link as='span'>Latest</Nav.Link>
                        </Link>
                    </Nav>
                </Navbar.Collapse>
                <Navbar.Collapse id='responsive-navbar-nav' className='justify-content-end'>
                    <Search />
                    <SessionControl />
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}