import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "@/styles/Account.module.css"

const UsernameAndAvatar = dynamic(() => import('./usernameAndAvatar'))

export default function ProfileLink({profile}) {
    return(
        <Link href={`/profile/${profile.id}`} passHref className={styles.profile_link}>
            <UsernameAndAvatar username={profile.user.name} avatar={profile.image} />
        </Link>
    )
}