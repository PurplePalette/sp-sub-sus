import express, { Express, Request, Response, NextFunction } from 'express';
import { GetObjectCommand, GetObjectCommandOutput, PutObjectCommand, S3, S3Client } from '@aws-sdk/client-s3';
import { fromSus } from "sonolus-pjsekai-engine"
import { gzipPromise, streamToString } from './utils';
import { Readable } from 'stream';
import crypto from 'crypto';

const bucket: string = process.env.S3_BUCKET!

const app: Express = express();
const s3: S3Client = new S3Client({
    credentials: {
        accessKeyId: process.env.S3_KEY!,
        secretAccessKey: process.env.S3_SECRET!,
    },
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: true,
    region: process.env.S3_REGION || 'unknown',
});

app.use(express.json())


app.post("/convert", async (req: express.Request, res: express.Response) => {
    const { hash }: PostConvert = req.body;
    let content: GetObjectCommandOutput;
    try {
        content = await s3.send(
            new GetObjectCommand({
                Bucket: bucket,
                Key: `/SusFile/${hash}`
            })
        )
    } catch {
        res.status(404).send({
            error: "File not found",
            code: "file_not_found"
        })
        return;
    }
    const body = content.Body as Readable;
    const data = await fromSus(await streamToString(body));
    const compressed = await gzipPromise(JSON.stringify(data));
    const compressedBuffer = Buffer.from(compressed);
    const compressedHash = crypto.createHash('sha1').update(compressedBuffer).digest('hex');
    await s3.send(
        new PutObjectCommand({
            Bucket: bucket,
            Key: `/LevelData/${compressedHash}`,
            Body: compressedBuffer
        })
    )
    res.json({
        hash: compressedHash
    })
})

app.use((_req: Request, res: Response, _next: NextFunction) => {
    res.status(404).json({ message: 'Not found' });
})

if (require.main === module) {
    const port = process.env.PORT || 3000;
    app.listen(+port, "0.0.0.0", () => {
        console.log(`Server listening on port ${port}`);
    });
}

interface PostConvert {
    hash: string
}