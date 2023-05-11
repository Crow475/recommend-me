import Link from 'next/link';

import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const {Button } = require('react-bootstrap');
const { PencilSquare} = require('react-bootstrap-icons');

export default function CreateButton({ profile }) {
    const { data: session } = useSession();
    const router = useRouter()

    if (session) {
        const asProfile = profile?profile:session.user.profile
        
        if (router.asPath !== "/create") {
            return(
                <Link href={`/create/${asProfile.id}`} passHref legacyBehavior>
                    <Button className=''>
                        <PencilSquare size={25}/>
                        <span className='d-none d-xl-inline align-text-top'> Create</span>
                    </Button>
                </Link>
            )
        } 
    }
}