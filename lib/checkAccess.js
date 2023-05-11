export default function CheckAccess(targetProfile, session) {
    if (session) {
        return(session.user.profile.id === targetProfile.id || session.user.role === "Admin")
    } else {
        return(false)
    }
}