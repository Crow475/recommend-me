const { Badge } = require('react-bootstrap');

export default function RatingBadge({rating}) {
    var badgeVariant = 'danger'
    
    if (rating === -1) {
        badgeVariant = 'secondary'
    } else if (rating > 6) {
        badgeVariant = 'success'
    } else if (rating > 3) {
        badgeVariant = 'warning'
    }

    const text = `${(rating === -1)? "?" : rating}/10`

    return (
        <Badge bg={badgeVariant} >{text}</Badge>
    )
}