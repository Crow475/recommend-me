import styles from '@/styles/Navbar.module.css'
import Link from 'next/link'
import dynamic from 'next/dynamic';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const {Container, Nav, Navbar, NavbarBrand, Row, Col} = require('react-bootstrap');
const { LightningChargeFill, HouseDoorFill, BarChartFill, TerminalFill} = require('react-bootstrap-icons')

const SessionControl = dynamic(() => import('./sessionControl'))
const Search = dynamic(() => import('./searchbar'))

export default function NavBar() {
    const router = useRouter();
    const { data: session } = useSession();

    const links = [
        {name: 'Home', href: '/', logo: <HouseDoorFill/>},
        {name: 'Top', href: '/top', logo: <BarChartFill/>},
        {name: 'Latest', href: '/latest', logo: <LightningChargeFill/>},
    ]

    if (session && session.user.role === "Admin") {
        links.push({name: 'Admin', href: '/admin', logo: <TerminalFill/>})
    }

    function Autonav() {
        return(
            <Nav>
                {links.map((element, id) => {
                    return(
                        <Link href={element.href} passHref className={styles.link} key={id}>
                            <Nav.Link as='h3' className='mb-0 pb-0' id={router.asPath === element.href? styles.active : styles.navlink}>
                                <Row>
                                    <Col xs={1} md={2}>
                                        {element.logo}
                                    </Col>
                                    <Col xs={10} md={9}>
                                        <h3>{element.name}</h3>
                                    </Col>
                                </Row>
                            </Nav.Link>
                        </Link>
                    );
                })}
            </Nav>
        )
    }

    return(
        <Navbar bg='light' variant='light' collapseOnSelect expand='lg' sticky='top' className={styles.navbar}>
            <Link href='/' className={styles.brand} passHref>
                <NavbarBrand className={styles.brand}>Recommend.me</NavbarBrand>
            </Link>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Container fluid>
                <Navbar.Collapse id='responsive-navbar-nav' className='justify-content-start'>
                    <Autonav />
                </Navbar.Collapse>
                <Navbar.Collapse id='responsive-navbar-nav' className='justify-content-end'>
                    <Search />
                    <SessionControl />
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}