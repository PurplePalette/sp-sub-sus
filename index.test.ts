import {
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3'
import 'dotenv/config'
import { promises as fs } from 'fs'

import request from 'supertest'
import app from './index'

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

describe('Main', () => {
    test('GET / returns ok', async () => {
        const response = await request(app).get('/')
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({ status: 'ok' })
    })

    test('POST /convert returns hash', async () => {
        await s3.send(
            new PutObjectCommand({
                Bucket: checkEnv('S3_BUCKET'),
                Key: 'SusFile/test',
                Body: await fs.readFile('./test.sus'),
            })
        )
        const postData = {
            hash: 'test',
        }
        const response = await request(app).post('/convert').send(postData)
        expect(response.statusCode).toBe(200)
        await s3.send(
            new GetObjectCommand({
                Bucket: checkEnv('S3_BUCKET'),
                Key: `LevelData/${response.body.hash}`,
            })
        ) // check if the file exists
    })

    test('POST /convert with unknown file returns 404', async () => {
        const postData = {
            hash: 'unknown',
        }
        const response = await request(app).post('/convert').send(postData)
        expect(response.statusCode).toBe(404)
    })
})

afterAll(() => {
    s3.destroy()
})
