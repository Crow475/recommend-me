import 'bootstrap/dist/css/bootstrap.min.css'

import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';

const ProfileLink = dynamic(() => import('../profile/profileLink'))

const {Card, Row, Col, Badge} = require('react-bootstrap');

export default function Comment(comment) {
    const { data: session } = useSession()

    var commentBg = 'white'

    if (session) {
        commentBg = (session.user.profile.id===comment.comment.author.id)?'light':'white'
    }
    
    function AuthorBadge() {
        if (comment.comment.author.id === comment.comment.review.author.id) {
            return (
                <Badge bg='info'>Author</Badge>
            )
        }
    }
    
    return(
        <Card className='my-2' bg={commentBg}>
            <Row className='mx-1 mt-2'>
                <Col lg={4} xs={6} >
                    <ProfileLink profile={comment.comment.author} />
                    <span className='mx-1'/>
                    <AuthorBadge />
                </Col>
                <Col lg={{span: 3, offset: 5}} xs={{span: 5, offset: 1}} className=''>
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