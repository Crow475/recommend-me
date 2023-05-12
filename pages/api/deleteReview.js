import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';

export default async function handle(req, res) {
    const session = await getServerSession(req, res, authOptions)
    console.log(req.body)

    if (session && req.body.authorId === session.user.profile.id) {
        console.log("Pew")
        try {
            const result = await prisma.review.delete({
                where: {
                    id: req.body.id
                }
            })
            console.log(result)
            res.status(200).json({result})
        } catch(err) {
            console.error(err)
            res.status(500).json({ error: 'failed to delete review' })
        }
    } else {
        res.status(401).json({ error: 'Unauthorized' })
    }
}