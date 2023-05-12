import prisma from "@/lib/prisma"

import { useRouter } from 'next/router' 
import { getProviders, signIn, getSession } from "next-auth/react"
import { Reddit, Github, Google } from 'react-bootstrap-icons'

const { Container, Row, Col, Card, Button } = require('react-bootstrap')

export default function SignIn({ providers }) {
    const router = useRouter()

    return (
        <Container  className="position-absolute top-50 start-50 translate-middle">
            <Row>
                <Col lg={{span: 4, offset: 4}} md={{span: 6, offset: 3}} sm={{span: 8, offset: 2}}>
                    <Card>
                        <Card.Body>
                            <Card.Title><h3 className="text-center">Recommend.me</h3></Card.Title>
                            <hr/>
                            <h4 className="text-center">Log in with</h4>
                            <br />
                            <Row className="my-2 mx-1">
                                <Button variant="dark" onClick={() => signIn(providers.github.id)}>
                                    <Github size={17} /> <span className='align-middle'> Github</span>
                                </Button>
                            </Row>
                            <Row className='my-2 mx-1'>
                                <Button variant="outline-dark" onClick={() => signIn(providers.google.id)}>
                                    <Google size={17} /> <span className='align-middle'> Google</span>
                                </Button>
                            </Row>
                            <Row className='my-2 mx-1'>
                                <Button variant="primary" onClick={() => signIn(providers.reddit.id)}>
                                    <Reddit size={17} /> <span className='align-middle'> Reddit</span>
                                </Button>
                            </Row>
                            <hr/>
                            <Row className="my-2 mx-1">
                                <Button variant="secondary" onClick={() => router.back()}>Cancel</Button>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
export async function getServerSideProps(context) {
    const { req, query } = context;
    const { callbackUrl } = query;
    const session = await getSession(context)

    const createProfile = async (e) => {
        if (!session.user.profile) {
            await prisma.user.update({
                where: {
                    id: session.user.id
                },
                data: {
                    profile: {
                        create: {
                            image: session.user.image
                        }
                    }
                }
            })
        }
    }
    
    if (session) {
        createProfile();
        return { redirect: { destination: callbackUrl } };
    }

    return { props: { providers: await getProviders() } };
}