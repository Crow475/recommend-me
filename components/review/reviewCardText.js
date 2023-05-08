import Markdown from 'markdown-to-jsx';
import styles from '@/styles/Card.module.css'

import { Image } from 'react-bootstrap';

const HeaderReplacement = ({ children }) => (
    <>
        <b>{children}</b>
        <br />
    </>
)

const ImageReplacement = ({ ...props }) => (
    <Image {...props} fluid alt='embeded image'/>
)

export default function ReviewCardText({ text }) {
    return(
        <div className={styles.card_text}>
            <Markdown 
                options={{
                    forceWrapper: true, 
                    wrapper: 'div',
                    overrides: {
                        h1: {
                            component: HeaderReplacement
                        },
                        h2: {
                            component: HeaderReplacement
                        },
                        h3: {
                            component: HeaderReplacement
                        },
                        h4: {
                            component: HeaderReplacement
                        },
                        h5: {
                            component: HeaderReplacement
                        },
                        h6: {
                            component: HeaderReplacement
                        },
                        ins: {
                            component: 'em'
                        },
                        img: {
                            component: ImageReplacement
                        }
                    }
                }}
            >
                {text.slice(0, 550)}
            </Markdown>
        </div>
    )
}