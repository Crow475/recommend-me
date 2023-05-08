import { PencilFill, PersonCircle } from 'react-bootstrap-icons';
import { useSession } from "next-auth/react";
import { useState, useRef } from "react";
import { useRouter } from 'next/router';

import styles from '@/styles/Account.module.css';

const {Card, Badge, Row, Col, Image, Button, ButtonToolbar, Form } = require('react-bootstrap');

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export default function ProfileCard({profile, published}) {
    const { data: session } = useSession();
    const [editing, setEditing] = useState(false)
    const [bio, setBio] = useState(profile.bio)
    const shareLikes = useRef(profile.shareLikes)
    const shareDislikes = useRef(profile.shareDislikes)
    const shareStats = useRef(profile.shareStats)
    const router = useRouter()

    const switches = [
        {setting: shareLikes, label: "Show liked reviews", helpText: "Let everyone see reviews you liked"},
        {setting: shareDislikes, label: "Show disliked reviews", helpText: "Let everyone see reviews you disliked"},
        {setting: shareStats, label:"Show user statistics", helpText: "Let everyone see your activiry statistics" }
    ]

    var userRating = 0

    published.map((review) => {
        userRating = userRating + review._count.likedBy - review._count.dislikedBy
    })

    const UpdateProfile = async (event) => {
        event.preventDefault()

        try {
            const body = {profile: profile, 
                          bio: bio.trim(),
                          shareLikes: shareLikes.current, 
                          shareDislikes: shareDislikes.current, 
                          shareStats: shareStats.current}
            console.log(body)
            await fetch(BaseUrl + '/api/updateProfile', {
                method: 'PUT',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            })
            router.reload(window.location.pathname)
        } catch(err) {
            console.log(err)
        }
    }

    function Avatar() {
        if (profile.image) {
            return(
                <Image src={profile.image} alt='user avatar' roundedCircle className={styles.avatar_big}/>
            )
        }
        return(
            <PersonCircle size={130} className='my-1'/>
        )
    }

    function UserStats() {
        if (profile.shareStats) {
            return (
                <Row>
                    <span>Stats</span>
                    <Row className='mx-1'>
                        <Col xs={7}>
                            <span>Reviews: </span>
                        </Col>
                        <Col xs={4}>
                            <Badge bg='info'>{published.length}</Badge>
                        </Col>
                    </Row>
                    <Row className='mx-1'>
                        <Col xs={7}>
                            <span>Comments: </span>
                        </Col>
                        <Col xs={4}>
                            <Badge bg='info'>{profile._count.comments}</Badge>
                        </Col>
                    </Row>
                    <Row className='mx-1'>
                        <Col xs={7}>
                            <span>Likes: </span>
                        </Col>
                        <Col xs={4}>
                            <Badge bg='info'>{profile._count.likedReviews}</Badge>
                        </Col>
                    </Row>
                    <Row className='mx-1'>
                        <Col xs={7}>
                            <span>Dislikes: </span>
                        </Col>
                        <Col xs={4}>
                            <Badge bg='info'>{profile._count.dislikedReviews}</Badge>
                        </Col>
                    </Row>
                </Row>
            )
        }
    }

    function EditButton() {
        if (session && session.user.profile.id === profile.id) {
            return(
                <Row className='mx-1 mt-3'>
                    <Button variant='secondary' onClick={() => setEditing(true)}><PencilFill/><span className='align-text-top'> Edit profile</span></Button>
                </Row>
            )
        }
    }

    function SettingSwitch({setting, label, helpText}) {
        return(
            <Row className='mx-1 my-1'>
                <Form.Check type='switch' 
                    label={label}
                    defaultChecked={setting.current} 
                    onChange={() => (setting.current = !setting.current)}
                />
                <Form.Text>{helpText}</Form.Text>
            </Row>
        )
    }
    
    if (!editing) {
        return (
            <Card>
                <Card.Body>
                    <Row className='mx-1'>
                        <Col>
                            <Avatar/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={8} >
                            <h4 className='my-2'>{profile.user.name}</h4>
                        </Col>
                        <Col xs={4} className='align-self-center'>
                            <Badge><span className='h5'>{userRating}</span></Badge>
                        </Col>
                    </Row>
                    <Row className='mx-2'>
                        <hr/>
                    </Row>
                    <Row className='mx-1'>
                        <p>{profile.bio}</p>
                    </Row>
                    <UserStats />
                    <EditButton />
                </Card.Body>
            </Card>
        )
    }
    return (
        <Card>
            <Card.Body>
                <Form onSubmit={UpdateProfile}>
                    <Row className='mx-1'>
                        <Col>
                            <Avatar/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={8} >
                            <h4 className='my-2'>{profile.user.name}</h4>
                        </Col>
                    </Row>
                    <Row className='mx-2'>
                        <hr/>
                    </Row>
                    <Row className='mx-1'>
                        <Col xs={10} lg={7} xl={9}>
                            <Form.Label>Bio</Form.Label>
                        </Col>
                        <Col xs={2} lg={5} xl={3} className='text-end'>
                            <Form.Text>{(bio)?bio.length:"0"}/200</Form.Text>
                        </Col>
                        <Form.Control as='textarea'
                            rows={3}
                            placeholder='Write a few words about yourself'
                            value={bio}
                            onChange={(e) => setBio(e.target.value.slice(0, 200))}
                        />
                    </Row>
                    <br/>
                    {switches.map((element) => {
                        return(
                            <SettingSwitch  key={element.label}
                                setting={element.setting} 
                                label={element.label} 
                                helpText={element.helpText} 
                            />
                        )
                    })}
                    <Row className='mx-1 mt-3'>
                        <ButtonToolbar>
                            <Button variant='secondary' className='mx-1' onClick={() => setEditing(false)}>Cancel</Button>
                            <Button className='mx-1' type='submit'>Save</Button>
                        </ButtonToolbar>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    )
}