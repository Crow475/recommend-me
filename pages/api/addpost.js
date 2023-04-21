import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"

export default async function handle(req, res) {

    const session = await getServerSession(req, res, authOptions)
    const result = await prisma.review.create({
        data: {
            author: { connect: { email: session?.user?.email } },
            header: "test review header",
            content: "test review content",
            work: "test review work",
            rating: 5
        }
    });
    res.json(result)
}