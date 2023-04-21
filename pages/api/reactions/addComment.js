import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions)

    if (session) {
        try {
            const result = await prisma.comment.create ({
                data: {
                    review: {
                        connect: {id: req.body.review.review.id}
                    },
                    author: {
                        connect: {id: session.user.profile.id}
                    },
                    content: req.body.content 
                }
            })
            res.status(200).json({result})
        } catch(err) {
            console.error(err)
            res.status(500).json({ error: 'failed to add new like' })
        }
    } else {
        res.status(401).json({ error: 'Unauthorized' })
    }
}