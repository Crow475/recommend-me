import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"

export default async function handle(req, res) {
    const session = await getServerSession(req, res, authOptions)

    if (session.user.profile.id === req.body.profile.id) {
        try {
            const result = await prisma.profile.update ({
                where: {
                    id: req.body.profile.id
                },
                data: {
                    bio: req.body.bio,
                    shareLikes: req.body.shareLikes,
                    shareDislikes: req.body.shareDislikes,
                    shareStats: req.body.shareStats
                }
            })
            res.status(200).json({result})
        } catch(err) {
            console.error(err);
            res.status(500).json({ error: 'failed to update profile' })
        }
    } else {
        res.status(401).json({ error: 'Unauthorized' })
    }
}