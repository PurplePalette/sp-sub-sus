import { Readable } from 'stream'
import { gzip } from 'zlib'

export function gzipPromise(data: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        gzip(data, (err, result) => {
            if (err) {
                reject(err)
            }
            resolve(result)
        })
    })
}

export function streamToString(stream: Readable): Promise<string> {
    const chunks: Buffer[] = []
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
        stream.on('error', (err) => reject(err))
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    })
}
