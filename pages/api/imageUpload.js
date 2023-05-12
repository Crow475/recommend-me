import { getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { IdempotencyStrategy, Storage } from '@google-cloud/storage';

const stream = require('node:stream')

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb'
        }
    }
}

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions)

    if (session) {
        try {
            const storage = new Storage({
                projectId: process.env.GCS_PROJECT_ID,
                retryOptions: {
                    autoRetry: true,
                    maxRetries: 10,
                    idempotencyStrategy: IdempotencyStrategy.RetryAlways
                },
                credentials: {
                    client_email: process.env.GCS_CLIENT_EMAIL,
                    private_key: process.env.GCS_PRIVATE_KEY.replace(/\\n/g, "\n"),
                },
            });
        
            const bucket = storage.bucket(process.env.NEXT_PUBLIC_API_GCS_BUCKET_NAME);
            const filename = `images/${session.user.id}/${req.body.name}`
            const destFile = bucket.file(filename)
        
            const passthroughStream = new stream.PassThrough();
            passthroughStream.write(Buffer.from(req.body.file))
            passthroughStream.end()
        
            async function streamFileUpload() {
                passthroughStream.pipe(destFile.createWriteStream())
            }
            const result = streamFileUpload().catch(console.error);
            res.status(200).json(result)
        } catch(err) {
            console.error(err)
            res.status(500).json({ error: 'failed to upload an image' })
        }
    } else {
        res.status(401).json({ error: 'Unauthorized' })
    }
}