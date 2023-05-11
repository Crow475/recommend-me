import prisma from "@/lib/prisma"

import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"

export default async function handle(req, res) {
    const session = await getServerSession(req, res, authOptions)

    if (session) {
        let authorId = session.user.profile.id
        
        if (req.body.profileId) {
            if (req.body.profileId === authorId || session.user.role === "Admin") {
                authorId = req.body.profileId
            }
        }
        try {
            let result
            if (req.method === 'PUT' && req.body.id) {
                result = await prisma.review.update({
                    where: {
                        id: req.body.id
                    },
                    data: {
                        header: req.body.header,
                        image: req.body.image,
                        content: req.body.content,
                        category: req.body.category,
                        work: req.body.work,
                        rating: req.body.rating,
                        tags: req.body.tags,
                        published: req.body.published
                    }
                })
            } else {
                result = await prisma.review.create({
                    data: {
                        author: { connect: { id: authorId } },
                        header: req.body.header,
                        image: req.body.image,
                        content: req.body.content,
                        category: req.body.category,
                        work: req.body.work,
                        rating: req.body.rating,
                        tags: req.body.tags,
                        published: req.body.published
                    }
                });
            }
            res.status(200).json({result})
        } catch(err) {
            console.error(err)
            res.status(500).json({ error: 'failed to add new review' })
        }
    } else {
        res.status(401).json({ error: 'Unauthorized' })
    }
}