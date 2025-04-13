import path from "path";
import crypto from "crypto";

export function getMimeType(fileName: string): string {
    const ext = path.extname(fileName);
    switch (ext) {
        case '.woff2':
            return 'font/woff2';
        case '.woff':
            return 'font/woff';
        case '.ttf':
            return 'font/ttf';
        case '.otf':
            return 'font/otf';
        case '.eot':
            return 'application/vnd.ms-fontobject';
        default:
            return 'application/octet-stream';
    }
}

export function generateEtag(buffer: Buffer): string {
    return `"${crypto.createHash('md5').update(buffer).digest('hex')}"`;
}