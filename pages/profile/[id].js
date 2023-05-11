import Head from 'next/head';
import prisma from '@/lib/prisma';
import dynamic from 'next/dynamic';
import CheckAccess from '@/lib/checkAccess';
import formatCreationDate from '@/lib/formatCreationDate';

import { Journals, CheckLg, HandThumbsUpFill, HandThumbsDownFill, GearFill } from 'react-bootstrap-icons';
import { authOptions } from "../api/auth/[...nextauth]";
import { useEffect, useState } from "react";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";

const {Row, Col, Container, Button, ButtonGroup } = require('react-bootstrap');

const ReviewFeed = dynamic(() => import('../../components/review/reviewFeed'));
const ScrollToTop = dynamic(() => import('../../components/scrollToTop'));
const ProfileCard = dynamic(() => import('../../components/profile/profileCard'));
const AccountSettings = dynamic(() => import('../../components/profile/accountSettings'))
const SearchBar = dynamic(() => import('../../components/navbar/searchbar'))

export async function getServerSideProps(context) {
    let session = await getServerSession(context.req, context.res, authOptions)

    let disliked = null
    let liked = null
    let drafts = null

    function UserInfo() {
        if (CheckAccess(context.params, session)) {
            return (
                {user: true,}
            )
        } else {
            return (
                {user: {
                    select: {
                        name: true
                    }
                },}
            )
        }
    }
    
    let profile = await prisma.profile.findUnique({
        where: {
            id: context.params.id
        },
        include: {
            ...UserInfo(),
            _count: {
                select: {
                    comments: true,
                    likedReviews: true,
                    dislikedReviews: true
                }
            }
        }
    })

    if (!profile) {
        return{
            notFound: true
        }
    }

    let published = await prisma.review.findMany({
        where: {
            author: {
                id: context.params.id
            },
            published: true
        },
        include: {
            author: {
                include: {
                  user: true
                }
            },
            likedBy: true,
            dislikedBy: true,
            _count: {
                select: { 
                    comments: true,
                    likedBy: true,
                    dislikedBy: true
                }
            }
        },
        orderBy: [{
        creationDate: 'desc',
        },],
    })
    published.map(review => {formatCreationDate(review)});

    if (CheckAccess(context.params, session)) {
        drafts = await prisma.review.findMany({
            where: {
                author: {
                    id: context.params.id
                },
                published: false
            },
            include: {
                author: {
                    include: {
                      user: true
                    }
                },
                likedBy: true,
                dislikedBy: true,
                _count: {
                  select: { comments: true }
                }
            },
            orderBy: [{
            creationDate: 'desc',
            },],
        })
        drafts.map(review => {formatCreationDate(review)});
    }

    if (CheckAccess(context.params, session) || profile.shareLikes) {
        liked = await prisma.review.findMany({
            where: {
                likedBy: {
                    some: {
                        id: context.params.id
                    }
                },
                published: true
            },
            include: {
                author: {
                    include: {
                      user: true
                    }
                },
                likedBy: true,
                dislikedBy: true,
                _count: {
                    select: { 
                        comments: true 
                    }
                }
            },
        })
        liked.map(review => {formatCreationDate(review)});
    }

    if (CheckAccess(context.params, session) || profile.shareDislikes) {
        disliked = await prisma.review.findMany({
            where: {
                dislikedBy: {
                    some: {
                        id: context.params.id
                    }
                },
                published: true
            },
            include: {
                author: {
                    include: {
                      user: true
                    }
                },
                likedBy: true,
                dislikedBy: true,
                _count: {
                  select: { comments: true }
                }
            },
        })
        disliked.map(review => {formatCreationDate(review)});
    }

    return{
        props: { profile, published, drafts, liked, disliked  }
    }

}

export default function ProfilePage(props) {
    const { data: session } = useSession();
    const [showBackButton, setShowBackButton] = useState(false);
    const [currentTab, setCurrentTab] = useState("published")

    useEffect(() => {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                setShowBackButton(true)
            } else {
                setShowBackButton(false)
            }
        });
    }, []);

    const title = `RecommendMe: ${props.profile.user.name}`

    const tabs = [
        {value: "published", label: "Reviews", logo: <CheckLg className='mx-1'/>},
        (props.drafts?{value: "drafts", label: "Drafts", logo: <Journals className='mx-1'/>}:null),
        (props.liked?{value: "liked", label: "Liked", logo: <HandThumbsUpFill className='mx-1'/>}:null),
        (props.disliked?{value: "disliked", label: "Disliked", logo: <HandThumbsDownFill className='mx-1'/>}:null),
    ]

    function TabButton({label, value, logo, className}) {
        return(
            <Button size='lg' 
                variant={(currentTab === value)?"primary":"light"}
                onClick={() => setCurrentTab(value)}
                className={className}
            >
                {logo}
                <span> {label}</span>
            </Button>
        )
    }

    function SettingsButton() {
        if (CheckAccess(props.profile, session)) {
            return (
                <Button size='lg'
                    variant={(currentTab === "settings")?"primary":"light"}
                    className='d-flex justify-content-start align-items-center'
                    onClick={() => setCurrentTab("settings")}
                >
                    <GearFill className='mx-1'/>
                    <span className='d-none d-lg-inline'> Settings</span>
                </Button>
            )
        }
    }

    function TopTabs() {
        if (props.drafts || props.liked || props.disliked) {
            return(
                <Row className='my-2'>
                    <Col>
                        <ButtonGroup>
                            {tabs.map((element, id) => {
                                if (element) {
                                    return(
                                        <TabButton label={element.label} value={element.value} logo={element.logo} key={id}/>
                                    )
                                }
                            })}
                            <SettingsButton />
                        </ButtonGroup>
                    </Col>
                </Row>
            )
        }
    }
    
    function SideTabs() {
        if (props.drafts || props.liked || props.disliked) {
            return(
                <>
                    {tabs.map((element, id) => {
                        if (element) {
                            return(
                                <Row className='my-1 mx-1' key={id}>
                                    <TabButton label={element.label} value={element.value} logo={element.logo} className='d-flex justify-content-start align-items-center'/>
                                </Row>
                            )
                        }
                    })}
                    {CheckAccess(props.profile, session)?<hr/>:null}
                    <Row className='my-1 mx-1'>
                        <SettingsButton />
                    </Row>
                </>
            )
        }
    }

    function ProfileContent() {
        return(
            <>
                <h2>{tabs.find(element => {if (element) {return (element.value === currentTab)}}).label}</h2>
                <Row className={(currentTab === "published")?"mb-1 pe-0 ":"d-none"}>
                    <SearchBar profile={props.profile} label={`Search ${props.profile.user.name}'s reviews`}/>
                </Row>
                <ReviewFeed reviews={props[currentTab]} fix={2}/>
            </>
        )
    }

    return(
        <>
            <Head>
                <title>{title}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main>
                <Container fluid>
                    <Row className='my-2'>
                        <h1>{`${props.profile.user.name}'s profile`}</h1>
                    </Row>
                    <Row className='my-2'>
                        <Col xs={12} lg={3}>
                            <ProfileCard profile={props.profile} published={props.published}/>
                        </Col>
                        <Col xs={12} lg={7}>
                            <Row className='d-xs-block d-lg-none'>
                                <TopTabs />
                            </Row>
                            <Row>
                                {(currentTab != "settings")?<ProfileContent/>:<AccountSettings profile={props.profile}/>}
                            </Row>
                        </Col>
                        <Col lg={2} className='d-none d-lg-block'>
                            <SideTabs />
                        </Col>
                    </Row>
                    {showBackButton?<ScrollToTop/>:null}
                </Container>
            </main>
        </>
    )
}