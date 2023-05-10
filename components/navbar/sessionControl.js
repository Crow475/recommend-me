import dynamic from 'next/dynamic';
import Link from 'next/link';

import { useSession, signIn, signOut } from "next-auth/react";

const {Button, ButtonToolbar, ButtonGroup} = require('react-bootstrap');
const { BoxArrowRight } = require('react-bootstrap-icons');

const UsernameAndAvatar = dynamic(() => import ('../profile/usernameAndAvatar'));
const CreateButton = dynamic(() => import('./createButton'))

export default function Account() {
    const { data: session } = useSession();

    if (session) {
        return(
            <ButtonToolbar className='my-2 mx-1 px-0'>
                <CreateButton />
                <ButtonGroup className='ms-1'>
                    <Link href={`/profile/${session.user.profile.id}`} passHref legacyBehavior>
                        <Button>
                            <UsernameAndAvatar username={session.user.name} avatar={session.user.image}/>
                        </Button>
                    </Link>
                    <Button size='me' variant='secondary' onClick={() => signOut()}>
                        <span className='d-none d-xl-inline'>Sign out</span> 
                        <BoxArrowRight size={25} className='d-inline d-xl-none'/>
                    </Button>
                </ButtonGroup>
            </ButtonToolbar>
        )
    }
    return(
        <div className='my-1 mx-2'>
            <Button size='me' variant='primary' onClick={() => signIn()}>Sign in</Button>
        </div>
    )
}