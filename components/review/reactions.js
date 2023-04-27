import { HandThumbsUp, HandThumbsUpFill, HandThumbsDown, HandThumbsDownFill, ChatDots, Share} from 'react-bootstrap-icons';
import { useSession, signIn} from "next-auth/react";
import { useState, useEffect } from 'react';
import Link from 'next/link';

const { Button, ButtonGroup, ButtonToolbar } = require('react-bootstrap');

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export default function Reactions(review) {
    const { data: session } = useSession()
    const [currentReview, setCurrentReview] = useState(review)
    const [reaction, setReaction] = useState(null)
    const [likeCount, setLikeCount] = useState(review.review.likedBy.length)
    const [dislikeCount, setDislikeCount] = useState(review.review.dislikedBy.length)
    const [ratio, setRatio] = useState(likeCount - dislikeCount)

    const reviewLink = BaseUrl + '/reviews/' + review.review.id
    const commentLink = reviewLink + '/#comment-section'

    const copyLink = (e) => {
        navigator.clipboard.writeText(reviewLink)
    }

    useEffect(() => {
        if (session) {
            if (session.user.profile.likedReviews.some(item => item.id === review.review.id)) {
                setReaction('like')
            } else if (session.user.profile.dislikedReviews.some(item => item.id === review.review.id)) {
                setReaction('dislike')
            } else {
                setReaction(null)
            }
        }
    }, [session, review.review.id])
    
    useEffect(() => {
        setRatio(likeCount - dislikeCount)
    }, [likeCount, dislikeCount])

    async function APIcall (path, method) {
        try {
            const body = {review: currentReview, method: method};
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

    var likeOrDislike

    if (session) {
        if (reaction === 'like') {
            likeOrDislike = (
                <>
                    <Button variant='success' onClick={() => Like('remove')}>
                        <HandThumbsUpFill size={22}/>
                    </Button>
                    <Button variant='danger' onClick={() => {Dislike('add'); setLikeCount(likeCount - 1)}}>
                        <HandThumbsDown size={22}/>
                    </Button>
                </>
            )    
        } else if (reaction === 'dislike') {
            likeOrDislike = (
                <>
                    <Button variant='success' onClick={() => {Like('add'); setDislikeCount(dislikeCount - 1)}}>
                        <HandThumbsUp size={22}/>
                    </Button>
                    <Button variant='danger' onClick={() => Dislike('remove')}>
                        <HandThumbsDownFill size={22}/>
                    </Button>
                </>
            )
        } else {
            likeOrDislike = (
                <>
                    <Button variant='success' onClick={() => Like('add')}>
                        <HandThumbsUp size={22}/>
                    </Button>
                    <Button variant='danger' onClick={() => Dislike('add')}>
                        <HandThumbsDown size={22}/>
                    </Button>
                </>
            )
        }
    } else {
        likeOrDislike = (
            <>
                <Button variant='success' onClick={signIn}>
                    <HandThumbsUp size={22}/>
                </Button>
                <Button variant='danger' onClick={signIn}>
                    <HandThumbsDown size={22}/>
                </Button>
            </>
        )
    }
    
    return(
        <ButtonToolbar className='mb-1'>
            <ButtonGroup className='mx-1 my-1'>
                <Button variant='secondary' disabled>{ratio}</Button>
                {likeOrDislike}
            </ButtonGroup>
            <ButtonGroup className='mx-2 my-1'>
                <Button variant='secondary' disabled>{review.review._count.comments}</Button>
                <Link href={commentLink} passHref legacyBehavior>
                    <Button variant='secondary'><ChatDots size={18}/></Button>
                </Link>
            </ButtonGroup>
            <Button className='mx-2 my-1' variant='secondary' onClick={copyLink}><Share className='align-middle' size={18}/></Button>
        </ButtonToolbar>
    )
   
}