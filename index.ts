import 'dotenv/config'
import express from 'express'
import { Request, Response } from 'express'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import crypto from 'crypto'
import { getSusData, gzipPromise, isS3Error } from './functions'
import { archetypes, bucket, inputNotes, S3Error } from './constants'

interface PostConvert {
    hash: string
}

const app = express()

function checkEnv(key: string): string {
    if (!process.env[key]) {
        console.log(`Missing environment variable: ${key}`)
        process.exit(1)
    }
    return process.env[key] || ''
}

const s3 = new S3Client({
    credentials: {
        accessKeyId: checkEnv('S3_KEY'),
        secretAccessKey: checkEnv('S3_SECRET'),
    },
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: true,
    region: process.env.S3_REGION || 'unknown',
})

app.use(express.json())

app.post('/convert', async (req: express.Request, res: express.Response) => {
    const { hash }: PostConvert = req.body
    const data = await getSusData(s3, hash, res)
    if (!data) {
        return
    }

    const compressed = await gzipPromise(JSON.stringify(data))
    const compressedBuffer = Buffer.from(compressed)
    const compressedHash = crypto
        .createHash('sha1')
        .update(compressedBuffer)
        .digest('hex')
    try {
        await s3.send(
            new PutObjectCommand({
                Bucket: bucket,
                Key: `LevelData/${compressedHash}`,
                Body: compressedBuffer,
            })
        )
        res.json({
            hash: compressedHash,
        })
    } catch (e: unknown) {
        if (isS3Error(e)) {
            const err: S3Error = e
            console.log(
                `S3 PutObject Error: ${err.$metadata.httpStatusCode} / ${err.Code}`
            )
        } else {
            console.log(`Unknown error while putting file: ${e}`)
        }
        res.status(500).json({
            error: 'Internal Server Error',
            code: 'internal_server_error',
        })
    }
})

app.post('/analyze', async (req: express.Request, res: express.Response) => {
    const { hash } = req.body
    const data = await getSusData(s3, hash, res)
    if (!data) {
        return
    }
    res.json({
        total: data.entities.filter((e) => inputNotes.includes(e.archetype))
            .length,
        objects: {
            slide: data.entities.filter((e) =>
                [archetypes.slideStart, archetypes.criticalSlideStart].includes(
                    e.archetype
                )
            ).length,
            tap: data.entities.filter((e) =>
                [archetypes.tapNote, archetypes.criticalTapNote].includes(
                    e.archetype
                )
            ).length,
            flick: data.entities.filter((e) =>
                [
                    archetypes.flickNote,
                    archetypes.slideEndFlick,
                    archetypes.criticalFlickNote,
                    archetypes.criticalSlideEndFlick,
                ].includes(e.archetype)
            ).length,
        },
    })
})

app.use((_req: Request, res: Response) => {
    res.status(404).json({ message: 'Not found' })
})

if (require.main === module) {
    const port = process.env.PORT || 3000
    app.listen(+port, '0.0.0.0', () => {
        console.log(`Server listening on port ${port}`)
    })
}
