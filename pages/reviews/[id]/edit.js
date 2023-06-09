import Head from 'next/head';
import prisma from '@/lib/prisma';
import dynamic from "next/dynamic";
import CheckAccess from '@/lib/checkAccess';
import formatCreationDate from '@/lib/formatCreationDate';

import { useSession } from 'next-auth/react';

const Editor = dynamic(() => import('../../../components/review/editor'));
const WrongAccount = dynamic(() => import('../../../components/banners/wrongAccount'))
const NotSignedIn = dynamic(() => import('../../../components/banners/notSignedIn'));

export const getServerSideProps = async ({ params }) => {
    let review = await prisma.review.findUnique({
        where: {
            id: params?.id
        },
        include: {
            author: {
                include: {
                  user: {
                    select: {
                        name: true
                    }
                  }
                }
            },
        },
    })

    if (!review) {
        return{
            notFound: true
        }
    }

    review = formatCreationDate(review)

    return {
        props: review
    }
}


const Edit = (props) => {
    const { data: session } = useSession();
    
    if (session) {
        if (CheckAccess(props.author, session)) {
            return(
                <>
                    <Head>
                        <title>RecommendMe - Edit: {props.header}</title>
                        <meta name='viewport' content='width=device-width, initial-scale=1' />
                    </Head>
                    <main>
                        <Editor review={props}/>
                    </main>
                </>
            )
        } else {
            return(
                <WrongAccount text="You cannot edit someone else's review!"/>
            )
        }
    } else {
        return(
            <NotSignedIn text='You need to be signed in to edit your reviews!'/>
        )
    }
}

export default Edit