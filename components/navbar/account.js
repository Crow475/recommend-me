import 'bootstrap/dist/css/bootstrap.min.css';

import Link from 'next/link';
import styles from '@/styles/Account.module.css';

import { useSession, signIn, signOut } from "next-auth/react";

const {Button, ButtonToolbar, Image, Row, Col, ButtonGroup} = require('react-bootstrap');

export default function Account() {
    const { data: session } = useSession()

    if (session) {
        return(
            <ButtonToolbar className='my-2 mx-2'>
                <ButtonGroup>
                    <Link href='/profile' passHref legacyBehavior>
                        <Button>
                            <Row>
                                <Col>
                                    <Image fluid roundedCircle src={session.user.image} alt='avatar' className={styles.avatar}></Image>
                                </Col>
                                <Col>
                                    <span className='align-text-top'>{session.user.name}</span>
                                </Col>
                            </Row>
                        </Button>
                    </Link>
                    <Button size='me' variant='secondary' className='hidden-sm' onClick={() => signOut()}>Sign out</Button>
                </ButtonGroup>
            </ButtonToolbar>
        )
    }
    return(
        <div className='my-1 mx-2'>
            <Button size='me' variant='primary' className='hidden-sm' onClick={() => signIn()}>Sign in</Button>
        </div>
    )
}