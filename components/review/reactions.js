import { HandThumbsUp, HandThumbsUpFill, HandThumbsDown, HandThumbsDownFill, ChatDots, Share, PencilFill} from 'react-bootstrap-icons';
import { StandardTooltipProps } from '@/lib/tooltipProps';
import { useSession, signIn} from "next-auth/react";
import { useState, useEffect, forwardRef } from 'react';
import Link from 'next/link';

const { Button, ButtonGroup, ButtonToolbar, OverlayTrigger, Tooltip, Popover } = require('react-bootstrap');

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export default function Reactions({review, vertical}) {
    const { data: session } = useSession()
    const [reaction, setReaction] = useState(null)
    const [likeCount, setLikeCount] = useState(review.likedBy.length)
    const [dislikeCount, setDislikeCount] = useState(review.dislikedBy.length)
    const [ratio, setRatio] = useState(likeCount - dislikeCount)

    const reviewLink = BaseUrl + '/reviews/' + review.id
    const commentLink = reviewLink + '/#comment-section'

    const copyLink = (e) => {
        navigator.clipboard.writeText(reviewLink)
    }

    useEffect(() => {
        if (session) {
            if (session.user.profile.likedReviews.some(item => item.id === review.id)) {
                setReaction('like')
            } else if (session.user.profile.dislikedReviews.some(item => item.id === review.id)) {
                setReaction('dislike')
            } else {
                setReaction(null)
            }
        }
    }, [session, review.id])
    
    useEffect(() => {
        setRatio(likeCount - dislikeCount)
    }, [likeCount, dislikeCount])

    async function APIcall (path, method) {
        try {
            const body = {review: review, method: method};
            await fetch(BaseUrl + path, {
                method: 'PUT',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            })
        } catch(err) {
            console.error(err)
        }
    }

    function Like(method) {
        APIcall('/api/reactions/Like', method)
        if (method === 'add') {
            APIcall('/api/reactions/Dislike', 'remove')
            setReaction('like')
            setLikeCount(likeCount + 1)
        } else {
            setReaction(null)
            setLikeCount(likeCount - 1)
        }
    }

    function Dislike(method) {
        APIcall('/api/reactions/Dislike', method)
        if (method === 'add') {
            APIcall('/api/reactions/Like', 'remove')
            setReaction('dislike')
            setDislikeCount(dislikeCount + 1)
        } else {
            setReaction(null)
            setDislikeCount(dislikeCount - 1)
        }
    }

    function EditButton({showLabel}) {
        const EditReview = forwardRef(function EditReview({ onClick, href }, ref) {
            return(
                <OverlayTrigger
                    {...StandardTooltipProps}
                    overlay={
                        <Tooltip>
                            Edit review
                        </Tooltip>
                    }
                >
                    <Button className='mx-1 my-1' ref={ref} href={href} onClick={onClick}>
                        <PencilFill className='align-middle' size={18}/>
                        {showLabel?<span className='mx-1 align-text-top'>Edit</span>:null}
                    </Button>
                </OverlayTrigger>
            )
        })
        
        if (session && session.user.profile.id === review.author.id) {
            return(
                <Link href={reviewLink + '/edit'} passHref legacyBehavior>
                    <EditReview />
                </Link>
            )
        }
    }

    const CommentButton = forwardRef(function CommentButton({ onClick, href}, ref) {
        return(
            <OverlayTrigger
                {...StandardTooltipProps}
                overlay={
                    <Tooltip>
                        Comments
                    </Tooltip>
                }
            >
                <Button variant='secondary' ref={ref} href={href} onClick={onClick}><ChatDots size={18}/></Button>
            </OverlayTrigger>
        )
    })

    const linkCopied = (
        <Popover>
            <Popover.Body>
                Link copied to clipboard!
            </Popover.Body>
        </Popover>
    )

    var likeButton
    var dislikeButton

    if (session) {
        if (!review.published) {
            return(
                <ButtonToolbar className='mb-1'>
                    <EditButton showLabel={true}/>
                </ButtonToolbar>
            )
        }

        if (reaction === 'like') {
            likeButton = (
                <Button variant='success' onClick={() => Like('remove')}>
                    <HandThumbsUpFill size={22}/>
                </Button>
            )
            dislikeButton = (
                <Button variant='danger' onClick={() => {Dislike('add'); setLikeCount(likeCount - 1)}}>
                    <HandThumbsDown size={22}/>
                </Button>
            )
        } else if (reaction === 'dislike') {
            likeButton = (
                <Button variant='success' onClick={() => {Like('add'); setDislikeCount(dislikeCount - 1)}}>
                    <HandThumbsUp size={22}/>
                </Button>
            )
            dislikeButton = (
                <Button variant='danger' onClick={() => Dislike('remove')}>
                    <HandThumbsDownFill size={22}/>
                </Button>
            )
        } else {
            likeButton = (
                <Button variant='success' onClick={() => Like('add')}>
                    <HandThumbsUp size={22}/>
                </Button>
            )
            dislikeButton = (
                <Button variant='danger' onClick={() => Dislike('add')}>
                    <HandThumbsDown size={22}/>
                </Button>
            )
        }
        
    } else {
        likeButton = (
            <Button variant='success' onClick={signIn}>
                <HandThumbsUp size={22}/>
            </Button>
        )
        dislikeButton = (
            <Button variant='danger' onClick={signIn}>
                <HandThumbsDown size={22}/>
            </Button>
        )
    }
    
    const likeAndDislike = (
        <>
            <OverlayTrigger
                {...StandardTooltipProps}
                overlay={
                    <Tooltip>
                        I like this
                    </Tooltip>
                }
            >
                {likeButton}
            </OverlayTrigger>
            <OverlayTrigger
                {...StandardTooltipProps}
                overlay={
                    <Tooltip>
                        I dislike this
                    </Tooltip>
                }
            >
                {dislikeButton}
            </OverlayTrigger>
        </>
    )

    const comment = (
        <Link href={commentLink} passHref legacyBehavior>
            <CommentButton />
        </Link>
    )

    const share = (
        <OverlayTrigger
            {...StandardTooltipProps}
            overlay={
                <Tooltip>
                    Copy review link
                </Tooltip>
            }
        >
            <ButtonGroup vertical={vertical}>
                <OverlayTrigger trigger="click" rootClose placement='top' overlay={linkCopied}>
                    <Button className='me-1 my-1' variant='secondary' onClick={copyLink}><Share className='align-middle' size={18}/></Button>
                </OverlayTrigger>
            </ButtonGroup>
        </OverlayTrigger>
    )

    return(
        <ButtonToolbar className='mb-1'>
            <ButtonGroup className='me-1 my-1'>
                <Button variant='secondary' disabled>{ratio}</Button>
                {likeAndDislike}
            </ButtonGroup>
            <ButtonGroup className='me-1 my-1'>
                <Button variant='secondary' disabled>{review._count.comments}</Button>
                {comment}
            </ButtonGroup>
            {share}
            <EditButton />
        </ButtonToolbar>
    )
   
}