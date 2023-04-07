import Link from 'next/link'

import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '@/styles/Navbar.module.css'
import dynamic from 'next/dynamic';

const {Container, Nav, Navbar, NavbarBrand, Row, Col} = require('react-bootstrap');
const Account = dynamic(() => import('./account'))
const Search = dynamic(() => import('./searchbar'))

export default function NavBar() {
    return(
        <Navbar bg='light' variant='light' collapseOnSelect expand='lg' sticky='top'>
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
                            <Nav.Link as='span'>Profile</Nav.Link>
                        </Link>
                    </Nav>
                </Navbar.Collapse>
                <Navbar.Collapse id='responsive-navbar-nav' className='justify-content-end'>
                    <Search />
                    <Account />
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}