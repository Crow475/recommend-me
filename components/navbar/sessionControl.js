import 'bootstrap/dist/css/bootstrap.min.css';

import Link from 'next/link';
import styles from '@/styles/Account.module.css';

import { PersonCircle } from 'react-bootstrap-icons';
import { useSession, signIn, signOut } from "next-auth/react";

const {Button, ButtonToolbar, Image, Row, Col, ButtonGroup} = require('react-bootstrap');

function UsernameAndAvatar({username, avatar}) {
    if (avatar) {
        return(
            <Row>
                <Col>
                    <Image fluid roundedCircle src={avatar} alt='avatar' className={styles.avatar}></Image>
                </Col>
                <Col>
                    <span className='align-text-top'>{username.replace(/\s/g, "")}</span>
                </Col>
            </Row>
        );
    }
    return(
        <Row>
            <Col>
                <PersonCircle size={25}/>
            </Col>
            <Col>
                <span className='align-text-top'>{username}</span>
            </Col>
        </Row>
    )
}

export default function Account() {
    const { data: session } = useSession()

    if (session) {
        return(
            <ButtonToolbar className='my-2 mx-2'>
                <ButtonGroup>
                    <Link href='/profile' passHref legacyBehavior>
                        <Button>
                            <UsernameAndAvatar username={session.user.name} avatar={session.user.image}/>
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