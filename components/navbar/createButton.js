import Link from 'next/link';

import { useRouter } from 'next/router';

const {Button } = require('react-bootstrap');
const { PencilSquare} = require('react-bootstrap-icons');

export default function CreateButton() {
    const router = useRouter()
    
    if (router.asPath !== "/create") {
        return(
            <Link href='/create' passHref legacyBehavior>
                <Button className=''>
                    <PencilSquare size={25}/>
                    <span className='d-none d-xl-inline align-text-top'> Create</span>
                </Button>
            </Link>
        )
    } 
}