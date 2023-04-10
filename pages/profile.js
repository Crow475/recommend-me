import dynamic from 'next/dynamic'

const NavBar = dynamic(() => import('../components/navbar/navbar'));

export default function Profile() {
    return(
        <>
            <NavBar/>
        </>
    )
}