import Head from 'next/head';
import dynamic from 'next/dynamic';

import { useSession } from 'next-auth/react';

const Editor = dynamic(() => import('../components/review/editor'))
const NotSignedIn = dynamic(() => import('../components/banners/notSignedIn'))

export default function Create() {
    const { data: session } = useSession();

    if (session) {
        return(
            <>
                <Head>
                    <title>RecommendMe - Create</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Head>
                <main>
                    <Editor />
                </main>
            </>
        )
    } else {
        return(
            <NotSignedIn text="You need to be signed in to write reviews!" />
        )
    }
}
