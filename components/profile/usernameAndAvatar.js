import styles from '@/styles/Account.module.css';

import { PersonCircle } from 'react-bootstrap-icons';

const {Image} = require('react-bootstrap');

export default function UsernameAndAvatar({username, avatar}) {
    if (avatar) {
        return(
            <>
                <Image referrerPolicy='no-referrer' fluid roundedCircle src={avatar} alt='avatar' className={styles.avatar}></Image>
                <span className={styles.username}> {username}</span>
            </>
        );
    }
    return(
        <>
            <PersonCircle size={25}/>
            <span className={styles.username}> {username}</span>
        </>
    )
}