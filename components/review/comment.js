import 'bootstrap/dist/css/bootstrap.min.css'

import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';

const UsernameAndAvatar = dynamic(() => import('../usernameAndAvatar'))

const {Card, Row, Col} = require('react-bootstrap');

export default function Comment(comment) {
    const { data: session } = useSession()

    var commentBg

    if (session) {
        commentBg = (session.user.profile.id===comment.comment.author.id)?'light':'white'
    } else
    commentBg = 'white'
    
    return(
        <Card className='my-2' bg={commentBg}>
            <Row className='mx-1 mt-2'>
                <Col lg={2} xs={4} >
                    <UsernameAndAvatar username={comment.comment.author.user.name} avatar={comment.comment.author.image}/>
                </Col>
                <Col lg={{span: 3, offset: 7}} xs={{span: 5, offset: 3}} className=''>
                    <p className='text-end'>{comment.comment.creationDate}</p>
                </Col>
            </Row>
            <Row className='mx-1'>
                <Col>
                    <p>{comment.comment.content}</p>
                </Col>
            </Row>
        </Card>
    )
}