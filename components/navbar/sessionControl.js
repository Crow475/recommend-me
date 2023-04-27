import dynamic from 'next/dynamic';
import Link from 'next/link';

import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from "next-auth/react";

const {Button, ButtonToolbar, ButtonGroup} = require('react-bootstrap');
const { PencilSquare, BoxArrowRight } = require('react-bootstrap-icons');

const UsernameAndAvatar = dynamic(() => import('../usernameAndAvatar'));

export default function Account() {
    const { data: session } = useSession();
    const router = useRouter();

    function CreateButton() {
        if (router.asPath !== "/create") {
            return(
                <Link href='/create' passHref legacyBehavior>
                    <Button className='mx-1'>
                        <PencilSquare size={25}/>
                        <span className='d-none d-xl-inline'> Create</span>
                    </Button>
                </Link>
            )
        } 
    }

    if (session) {
        return(
            <ButtonToolbar className='my-2 mx-1 px-0'>
                <CreateButton />
                <ButtonGroup>
                    <Link href='/profile' passHref legacyBehavior>
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