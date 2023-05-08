import dynamic from 'next/dynamic';
import styles from '@/styles/Review.module.css'
import ReadableCategory from '@/lib/readableCategory';
import GetFileExtension from '@/lib/getFileExtension';

import { InfoCircleFill, XCircle, TrashFill, CheckLg, JournalPlus, XLg, MarkdownFill } from 'react-bootstrap-icons';
import { SupportedFileExtensions, SupportedMIMETypes } from '@/lib/supportedImages';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

const {Card, Row, Col, Container, Image, Button, Form, ButtonToolbar, InputGroup, DropdownButton, Dropdown, ButtonGroup, Alert, Badge} = require('react-bootstrap');

const RatingBadge = dynamic(() => import('./ratingBadge'))
const ConfirmDelete = dynamic(() => import('../dialogs/confirmDelete'))

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL


export default function Editor({review}) {
    const router = useRouter()
    const { data: session } = useSession();
    const [rating, setRating] = useState((review)?review.rating:-1)
    const [header, setHeader] = useState((review)?review.header:"")
    const [category, setCategory] = useState((review)?review.category:"")
    const [work, setWork] = useState((review)?review.work:"")
    const [reviewImage, setReviewImage] = useState("")
    const [imageLink, setImageLink] =useState((review)?review.image:null)
    const [imageOk, setImageOk] = useState(true)
    const [content, setContent] = useState((review)?review.content:"")
    const [publish, setPublish] = useState((review)?review.published:false)
    const [tags, setTags] = useState((review)?review.tags:[])
    const [tagInput, setTagInput] = useState("")
    const [showErrors, setShowErrors] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState(false)
    
    const onImageChange = (e) => {
        setReviewImage(e.target.files[0])
        setImageOk(!(e.target.files[0].size > 3145728) && SupportedFileExtensions.includes(GetFileExtension(e.target.files[0].name)))
        var fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
            setImageLink(fileReader.result)
        })
        fileReader.readAsDataURL(e.target.files[0])
    }
    
    function DeleteTag({onClick}) {
        return(
            <XCircle size={15} onClick={onClick} className='ms-1 align-text-bottom'/>
        )
    }
    
    function AddTag() {
        if (!tags.includes(tagInput) && tagInput !== "" && tagInput.length <= 20 && tags.length < 20) {
            setTags(tags.concat(tagInput))
            setTagInput("")
        }
    }
    
    function FileAlert() {
        if (reviewImage) {
            var text
            if (reviewImage.size > 3145728) {
                text = "The file is too large!"
            } else if (!SupportedFileExtensions.includes(GetFileExtension(reviewImage.name))) {
                text = "Unsupported file extension!"
            }
            if (!imageOk) {
                return (
                    <Alert variant='danger' className='mt-2 mb-0'>{text}</Alert>
                )
            }
        }
    }
    
    function ImagePreview() {
        if (imageLink && imageOk) {
            return(
                <Card>
                    <Card.Body>
                        <div className={styles.image}>
                            <Image thumbnail fluid src={imageLink} alt='image preview'/>
                        </div>
                    </Card.Body>
                </Card>
            )
        }
    }
    
    function ImageForm() {
        if (reviewImage || imageLink) {
            return (
                <Row className='my-1 mx-1'>
                    <InputGroup className='px-0'>
                        <Form.Control type="file" onChange={onImageChange} accept={SupportedMIMETypes}/>
                        <Button onClick={() => {setReviewImage(""); setImageLink(""); setImageOk(true)}}>Cancel</Button>
                    </InputGroup>
                    <FileAlert/>
                </Row>
            )
        }
        return (
            <Row className='my-1 mx-1'>
                <Form.Label>Add cover image to your review!</Form.Label>
                <Form.Control type="file" onChange={onImageChange} accept={SupportedMIMETypes}/>
            </Row>
        )
    }

    function DeleteButton() {
        if (review && session && review.author.id === session.user.profile.id) {
            return(
                <>
                    <ConfirmDelete show={deleteDialog} 
                        onCancel={() => setDeleteDialog(false)} 
                        onConfirm={handleDelete}
                        header={review.published?"Confirm review deletion":"Confirm draft deletion"}
                        text={review.published?"Are you sure you want to delete this review? All comments and likes will be lost.":"Are you sure you want to delete this draft?"}
                    />
                    <Button variant='danger' onClick={() => setDeleteDialog(true)}>
                        <TrashFill size={20}/>
                        <span className='d-none d-xl-inline align-text-top'> Delete</span>
                    </Button>
                </>
            )
        }
    }

    function DraftButton() {
        if (!(review && review.published)) {
            return(
                <Button variant='secondary' type='submit' onClick={() => setPublish(false)}>
                    <JournalPlus size={20}/>
                    <span className='d-none d-lg-inline align-text-top'> Save draft</span>
                </Button>
            )
        }
    }
    
    function PublishToolbar() {
        return(
            <Row className='mb-1'>
                <ButtonToolbar className='justify-content-end'>
                    <ButtonGroup className='mx-1'>
                        <DeleteButton />
                        <Button variant={review?'secondary':'danger'} onClick={() => router.back()}>
                            {review?<XLg size={20}/>:<TrashFill size={20}/>}
                            <span className='d-none d-xl-inline align-text-top'> {review?"Cancel":"Discard"}</span>
                        </Button>
                    </ButtonGroup>
                    <ButtonGroup>
                        <DraftButton />
                        <Button variant='success' type='submit' onClick={() => setPublish(true)}>
                            <CheckLg size={20}/>
                            <span className='align-text-top'> Publish</span>
                        </Button>
                    </ButtonGroup>
                </ButtonToolbar>
            </Row>
        )
    }

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

    const handleDelete = async (event) => {
        if (review && session && review.author.id === session.user.profile.id) {
            try {
                const body = {
                    id: review.id,
                    authorId: session.user.profile.id
                }
                const response = await fetch(BaseUrl + '/api/deleteReview', {
                    method: 'DELETE',
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(body)
                })
                const data = await response.json()
                router.push('/')
            } catch(err) {
                console.error(err)
            }
        }
    }
    
    const handleSubmit = async (event) => {
        event.preventDefault()
        
        if (header && 
            work && 
            category && 
            rating !== -1 &&
            header.length <= 100 &&
            header.length >= 3) {
            try {
                var body = {header: header, 
                            content: content, 
                            category: category, 
                            work: work, 
                            rating: Number(rating), 
                            tags: tags, 
                            published: publish,
                            image: null,
                            id: null}
                if (review) {
                    body.image = (review.image === imageLink)?review.image:null
                    body.id = review.id
                }
                if (reviewImage && imageOk) {
                    await uploadImage(reviewImage).then(
                        body.image = `https://storage.googleapis.com/${process.env.NEXT_PUBLIC_API_GCS_BUCKET_NAME}/images/${session.user.id}/${reviewImage.name}`
                    )
                }
                const response = await fetch(BaseUrl + '/api/addReview', {
                    method: (review?'PUT':'POST'),
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(body)
                })
                const data = await response.json()
                console.log(data.result.id)
                router.push(`${BaseUrl}/reviews/${data.result.id}`)
            } catch(err) {
                console.error(err)
            }
        } else {
            setShowErrors(true)
        }
    }

    return(
        <Container fluid>
            <Form onSubmit={handleSubmit}>    
                <Row className='mt-2'>
                    <Col xs={12}>
                        <h1>
                            <RatingBadge rating={rating}/>
                            <span> {(header === "")?"Review header":header}</span>
                        </h1>
                    </Col>
                    <Col  xs={12} md={5} lg={4} xl={3}>
                        
                    </Col>
                </Row>
                <PublishToolbar />
                <Row>
                    <Col lg={3}>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <InfoCircleFill size={20} className='mx-2'/> 
                                    <span> Review info</span>
                                </Card.Title>
                                <Row className='my-1 py-2'>
                                    <Col xs={10} lg={7} xl={9}>
                                        <Form.Label>Header *</Form.Label>
                                    </Col>
                                    <Col xs={2} lg={5} xl={3} className='text-end'>
                                        <Form.Text>{header.length}/100</Form.Text>
                                    </Col>
                                    <Col xs={12}>
                                        <Form.Control type='text' 
                                            placeholder='Write a descriptive header!'
                                            value={header} 
                                            onChange={(e) => setHeader(e.target.value)}
                                        />
                                        <span className='text-danger'>{(showErrors && !header)?" Your review needs a header!":""} </span>
                                        <span className='text-danger'>{(showErrors && header && (header.length > 100 || header.length < 3))?"Header must be 3-100 characters long!":""}</span>
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
                                                value={work}
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
                                    <Col xs={10} lg={7} xl={9}>
                                        <Form.Label>Tags</Form.Label>
                                    </Col>
                                    <Col xs={2} lg={5} xl={3} className='text-end'>
                                        <Form.Text>{tags.length}/20</Form.Text>
                                    </Col>
                                    <Col className='mb-1'>
                                        {tags.map((name, id) => (
                                            <Badge bg='info' className='mx-1' key={id}>
                                                {name}
                                                <DeleteTag onClick={() => setTags(tags.filter(element => element !== name))}/>
                                            </Badge>
                                        ))}
                                    </Col>
                                    <InputGroup className='mt-1'>
                                        <Form.Control type='text'
                                            placeholder='Name of a tag'
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value.trim().replace(/ /g, "_").slice(0, 20))}
                                        />
                                        <Button onClick={AddTag} >Add</Button>
                                    </InputGroup>
                                    <Form.Text>Make it easier for others to find your review</Form.Text>
                                    <span className='text-danger'>{tags.includes(tagInput)?"Tags have to be unique!":""}</span>
                                    <span className='text-warning'>{(tags.length >= 20)?"Cannot add more tags!":""}</span>
                                </Row>
                                <span className={(!header || !work || !category || rating === -1) && showErrors?"text-danger":'text-muted'}> * - required fields</span>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={12} lg={8}  className={styles.content}>
                        <ImageForm/>
                        <Row className='my-1 mx-1'>
                            <ImagePreview />
                        </Row>
                        <Row className='my-1 mx-1'>
                            <Form.Control as='textarea' 
                                rows={17} 
                                placeholder='The text of the review goes here!' 
                                value={content} 
                                onChange={(e) => setContent(e.target.value)}
                            />
                            <Form.Text>
                                <MarkdownFill size={18}/> 
                                <span className='align-text-top ms-1'>You can use </span>
                                <a href='https://www.markdownguide.org/basic-syntax/' target="_blank" className={styles.mdLink}>
                                    <span className='align-text-top'>Markdown</span>
                                </a>
                                <span className='align-text-top'> to make this text look <em>fancy</em>!</span>
                            </Form.Text>
                        </Row>
                    </Col>
                </Row>
            </Form>
        </Container>
    )
}