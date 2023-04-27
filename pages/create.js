import Head from 'next/head';
import dynamic from 'next/dynamic';
import styles from '@/styles/Review.module.css'
import formatCreationDate from '@/lib/formatCreationDate';
import ReadableCategory from '@/lib/readableCategory';

import { useState } from 'react';
import { InfoCircleFill, TrashFill, CheckLg, JournalPlus } from 'react-bootstrap-icons';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

const {Card, Row, Col, Container, Image, Button, Form, ButtonToolbar, InputGroup, DropdownButton, Dropdown, ButtonGroup} = require('react-bootstrap');

const UsernameAndAvatar = dynamic(() => import('../components/usernameAndAvatar'));
const RatingBadge = dynamic(() => import('../components/review/ratingBadge'))

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export default function Create() {
    const router = useRouter()
    const { data: session } = useSession();
    const [rating, setRating] = useState(-1)
    const [header, setHeader] = useState("")
    const [category, setCategory] = useState("")
    const [work, setWork] = useState("")
    const [reviewImage, setReviewImage] = useState("")
    const [imageLink, setImageLink] =useState()
    const [content, setContent] = useState("")
    const [publish, setPublish] = useState(false)
    const [tags, setTags] = useState([])
    const [showErrors, setShowErrors] = useState(false)

    var time = {creationDate: new Date(Date.now())}
    time = formatCreationDate(time)

    async function uploadImage(file) {
        var fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
            var finalFile = fileReader.result;
            finalFile = Array.from(new Uint8Array(finalFile))
            const body = {file: finalFile, name: file.name}
        
            async function sendData() {
                await fetch(BaseUrl + '/api/imageUpload', {
                    method: 'POST',
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(body),
                })
            }
            sendData()
        }, false);
        fileReader.readAsArrayBuffer(file)
    }

    const onImageChange = (e) => {
        setReviewImage(e.target.files[0])
        var fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
            setImageLink(fileReader.result)
        })
        fileReader.readAsDataURL(e.target.files[0])
    }

    function ImagePreview() {
        if (imageLink) {
            return(
                <Card>
                    <Card.Body>
                        <div className={styles.image}>
                            <Image thumbnail fluid src={imageLink} alt='image'/>
                        </div>
                    </Card.Body>
                </Card>
            )
        }
    }

    function ImageForm() {
        if (reviewImage) {
            return (
                <Row className='my-1 mx-1'>
                    <InputGroup className='px-0'>
                        <Form.Control type="file" onChange={onImageChange} accept="image/*"/>
                        <Button onClick={() => {setReviewImage(""); setImageLink("")}}>Cancel</Button>
                    </InputGroup>
                </Row>
            )
        }
        return (
            <Row className='my-1 mx-1'>
                <Form.Label>Add cover image to your review!</Form.Label>
                <Form.Control type="file" onChange={onImageChange} accept="image/*"/>
            </Row>
        )
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        
        if (header && 
            work && 
            category && 
            rating !== -1 &&
            header.length <= 100 &&
            header.length > 3) {
            try {
                var body = {header: header, 
                            content: content, 
                            category: category, 
                            work: work, 
                            rating: Number(rating), 
                            tags: tags, 
                            published: publish,
                            image: null
                           }
                if (reviewImage) {
                    uploadImage(reviewImage)
                    body.image = `https://storage.googleapis.com/image_storage-recommend-me/images/${session.user.id}/${reviewImage.name}`
                }
                console.log(body)
                const response = await fetch(BaseUrl + '/api/addReview', {
                    method: 'POST',
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(body)
                })
                const data = await response.json()
                router.push(`reviews/${data.result.id}`)
            } catch(err) {
                console.error(err)
            }
        } else {
            setShowErrors(true)
        }

    }

    if (session) {
        return(
            <>
                <Head>
                    <title>RecommendMe - Create</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Head>
                <main>
                    <Container fluid>
                        <Form onSubmit={handleSubmit}>    
                            <Row className='my-2'>
                                <Col xs={7} lg={8} xl={9}>
                                    <h1>
                                        <RatingBadge rating={rating}/>
                                        <span> {(header === "")?"Review header":header}</span>
                                    </h1>
                                </Col>
                                <Col  xs={5} lg={4} xl={3}>
                                    <ButtonToolbar className='my-2'>
                                        <Button variant='danger' className='mx-1' onClick={() => router.back()}>
                                            <TrashFill size={20}/>
                                            <span className='d-none d-xl-inline'> Discard</span>
                                        </Button>
                                        <ButtonGroup>
                                            <Button variant='secondary' type='submit' onClick={() => setPublish(false)}>
                                                <JournalPlus size={20}/>
                                                <span className='d-none d-lg-inline'> Save draft</span>
                                            </Button>
                                            <Button variant='success' type='submit' onClick={() => setPublish(true)}>
                                                <CheckLg size={20}/>
                                                <span className='d-none d-lg-inline'> Publish</span>
                                            </Button>
                                        </ButtonGroup>
                                    </ButtonToolbar>
                                </Col>
                            </Row>
                            <Row className='my-2'>
                                <Col lg={3}>
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>
                                                <InfoCircleFill size={20} className='mx-2'/> 
                                                <span> Review info</span>
                                            </Card.Title>
                                            <Row className='my-1 py-2'>
                                                <Form.Label>Header *</Form.Label>
                                                <Col>
                                                    <Form.Control type='text' 
                                                        placeholder='Write a descriptive header!' 
                                                        onChange={(e) => setHeader(e.target.value)}
                                                    />
                                                    <span className='text-danger'>{(showErrors && !header)?"Your review needs a header!":""} </span>
                                                    <span className='text-danger'>{(showErrors && header && (header.length > 100 || header.length < 4))?"Header must be 3-100 characters long!":""}</span>
                                                </Col>
                                            </Row>
                                            <Row className='my-1 py-2'>
                                                <Form.Label>Work *</Form.Label>
                                                <Col>
                                                    <InputGroup>
                                                        <DropdownButton title={ReadableCategory(category)}>
                                                            <Dropdown.Item onClick={() => setCategory("Movie")}>Movie</Dropdown.Item>
                                                            <Dropdown.Item onClick={() => setCategory("Book")}>Book</Dropdown.Item>
                                                            <Dropdown.Item onClick={() => setCategory("VideoGame")}>Video game</Dropdown.Item>
                                                            <Dropdown.Item onClick={() => setCategory("TVSeries")}>TV series</Dropdown.Item>
                                                        </DropdownButton>
                                                        <Form.Control type='text' 
                                                            placeholder={`Name of the ${(category)?ReadableCategory(category):"work"}`}
                                                            onChange={(e) => setWork(e.target.value)}
                                                        />
                                                    </InputGroup>
                                                    <span className='text-danger'>{(showErrors && !category)?"Choose the category!":""} </span>
                                                    <span className='text-danger'>{(showErrors && !work)?"The name of the work is required":""} </span>
                                                </Col>
                                            </Row>
                                            <Row className='my-1 py-2'>
                                                <Form.Label>Rating *</Form.Label>
                                                <Col xs={1}>
                                                    <span>0</span>
                                                </Col>
                                                <Col xs={9}>
                                                    <Form.Range max={10} min={0} step={1} value={rating} onChange={(e) => setRating(e.target.value)}/>
                                                </Col>
                                                <Col xs={2} className='mx-0 px-0 text-nowrap'>
                                                    <span>10</span>
                                                </Col>
                                                <Form.Text>How did you like it on a scale of 10?</Form.Text>
                                                <span className='text-danger'>{(showErrors && rating === -1)?"Set the rating from 0 to 10!":""} </span>
                                            </Row>
                                            <Row className='my-1 py-2'>
                                                <Col xs={6}>
                                                    <UsernameAndAvatar username={session.user.name} avatar={session.user.profile.image}/>
                                                </Col>
                                                <Col xs={6}>
                                                    <p>{time.creationDate}</p>
                                                </Col>
                                            </Row>
                                            <span className='text-muted'> * - required fields</span>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xs={12} lg={8}  className={styles.content}>
                                    <ImageForm/>
                                    <Row className='my-1 mx-1'>
                                        <ImagePreview />
                                    </Row>
                                    <Row className='my-1 mx-1'>
                                        <Form.Control as='textarea' rows={19} placeholder='The text of the review goes here!' value={content} onChange={(e) => setContent(e.target.value)}/>
                                    </Row>
                                </Col>
                            </Row>
                        </Form>
                    </Container>
                </main>
            </>
        )
    } else {
        return(
            <Container  className="position-absolute top-50 start-50 translate-middle">
                <Row>
                    <Col lg={{span: 4, offset: 4}} md={{span: 6, offset: 3}} sm={{span: 8, offset: 2}}>
                        <Card>
                            <Card.Body>
                                <Card.Title>You need to be signed in to write reviews!</Card.Title>
                                <br/>
                                <Row className='my-2 mx-1'>
                                    <Button onClick={() => signIn()}>Sign in</Button>
                                </Row>
                                <hr/>
                                <Row className='my-2 mx-1'>
                                    <Button onClick={() => router.back()} variant='secondary'>Cancel</Button>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}