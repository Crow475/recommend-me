import Head from 'next/head';
import prisma from '@/lib/prisma';
import dynamic from 'next/dynamic';

import { useSession } from 'next-auth/react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";

const {Row, Container, Table, Badge } = require('react-bootstrap');

const NotSignedIn = dynamic(() => import('../components/banners/notSignedIn'));
const ProfileLink = dynamic(() => import('../components/profile/profileLink'));
const WrongAccount = dynamic(() => import('../components/banners/wrongAccount'));

export async function getServerSideProps(context) {
    let session = await getServerSession(context.req, context.res, authOptions)

    if (session && session.user.role === "Admin") {
        let Users = await prisma.user.findMany({
            include: {
                profile: {
                    include: {
                        user: true                    }
                },
                _count: {
                    select: {
                        sessions: true
                    }
                }
            },
            orderBy: [
                {
                    name: 'asc'
                },
                {
                    role: 'desc'
                }
            ] 
        })
        
        return{
            props: {Users}
        }
    } else {
        return {
            props: { nothing: null }
        }
    }

}

export default function AdminPanel(props) {
    const { data: session } = useSession();

    if (session) {
        if (session.user.role === "Admin") {
            function UserRecord({user, id}) {
                return(
                    <tr>
                        <td>{id}</td>
                        <td>{user.email}</td>
                        <td><ProfileLink profile={user.profile}/></td>
                        <td><Badge bg={(user.role === "Admin")?'danger':'secondary'}>{user.role}</Badge></td>
                        <td>{user._count.sessions}</td>
                        <td>{user.id}</td>
                        <td>{user.profile.id}</td>
                    </tr>
                )
            }
            
            return(
                <>
                    <Head>
                        <title>RecommendMe - Admin Panel</title>
                        <meta name="viewport" content="width=device-width, initial-scale=1" />
                    </Head>
                    <main>
                        <Container fluid>
                            <Row className='my-2 mx-1'>
                                <h1>Users</h1>
                            </Row>
                            <Row className='mx-1'>
                                <Table striped borderless hover responsive>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Email</th>
                                            <th>Profile link</th>
                                            <th>Role</th>
                                            <th>Active sessions</th>
                                            <th>User ID</th>
                                            <th>Profile ID</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {props.Users.map((user, id) => {
                                            return(
                                                <UserRecord user={user} id={id} key={user.id} />
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </Row>

                        </Container>
                    </main>
                </>
            );
        } else {
            return(
                <WrongAccount text="Sign in using admin account to use admin tools!"/>
            );
        };
    } else {
        return(
            <NotSignedIn text="Sign in using admin account to use admin tools!" />
        );
    };
};