import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"

export default async function handle(req, res) {
    const session = await getServerSession(req, res, authOptions)

    if (session) {
        try {
        if (req.body.method === 'add') {
            const result = await prisma.profile.update ({
                where: {
                    userId: session.user.id
                },
                data: {
                    dislikedReviews: {
                        connect: {id: req.body.review.id}
                    }
                }
            })
            res.status(200).json({result})
        } else if (req.body.method === 'remove') {
            const result = await prisma.profile.update ({
                where: {
                    userId: session.user.id
                },
                data: {
                    dislikedReviews: {
                        disconnect: {id: req.body.review.id}
                    }
                }
            })
            res.status(200).json({result})
        }
        } catch(err) {
            console.error(err)
            res.status(500).json({ error: 'failed to add new dislike' })
        }
    } else {
        res.status(401).json({ error: 'Unauthorized' })
    }
}
