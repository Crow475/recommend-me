import prisma from "@/lib/prisma"
import CheckAccess from '@/lib/checkAccess'

import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"

export default async function handle(req, res) {
    const session = await getServerSession(req, res, authOptions)

    if (CheckAccess(req.body.profile, session)) {
        try {
            const user = req.body.profile.user
            
            const result1 = await prisma.profile.delete({
                where: {
                    id: req.body.profile.id
                }
            })

            const result2 = await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    profile: {
                        create: {
                            image: user.image
                        }
                    }
                }
            })
            res.status(200).json({result1, result2})
        } catch(err) {
            console.error(err)
            res.status(500).json({ error: 'failed to delete profile' })
        }
    } else {
        res.status(401).json({ error: 'Unauthorized' })
    }
}