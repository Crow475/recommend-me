import Markdown from 'markdown-to-jsx';

import { Image } from 'react-bootstrap';

const EmbededImage = ({ ...props }) => (
    <Image {...props} fluid thumbnail alt='embeded image'/>
)

export default function ReviewText({ text }) {
    return(
        <Markdown 
            id="text"
            options={{ 
                forceBlock: true, 
                wrapper: 'div',
                overrides: {
                    img: {
                        component: EmbededImage
                    }
                }
            }}
        >
            {text}
        </Markdown>
    )
}