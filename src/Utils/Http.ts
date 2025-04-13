import type {TIncomingMessage, TServerResponse} from "@Types/HttpClient";

export function Response(res: TServerResponse, data: string | object | any[], status: number = 200): void {
    res.statusCode = status;

    if (res.cameInAt) {
        res.setHeader('X-MUSIC-RESOLVE-RESPONSE-TIME', (Date.now() - res.cameInAt).toString());
    }

    if (typeof data === 'object') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
    } else {
        res.setHeader('Content-Type', 'text/plain');
        res.end(data);
    }
}

export function Redirect(res: TServerResponse, url: string, statusCode: 301 | 302 = 301): void {
    res.statusCode = statusCode;
    res.setHeader('Location', url);
    res.end();
}

export function ImageResponse(res: TServerResponse, buffer: Buffer, statusCode: number = 200): void {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'image/jpeg');
    res.end(buffer);
}

export function getQuery(req: TIncomingMessage): Record<string, string | number> {
    const url = new URL(req.url || '', `https://${req.headers.host}`);
    const query: Record<string, string | number> = {};
    const params = url.searchParams;

    for (const key of params.keys()) {
        const value = params.get(key);
        if (value !== null) {
            query[key] = isNaN(Number(value)) ? value : Number(value);
        }
    }

    return query;
}

export function getParams(req: TIncomingMessage, context: { path: string }): Record<string, string> {
    if (req.params) {
        return req.params;
    }

    const routeParts = context.path.split('/');
    const urlParts = (req.url || '').split('?')[0].split('/');

    const params: Record<string, string> = {};

    for (let i = 0; i < routeParts.length; i++) {
        const part = routeParts[i];

        if (part.startsWith(':')) {
            const paramName = part.slice(1);
            params[paramName] = urlParts[i] || '';
        }
    }

    return params;
}

export function setCookies(res: TServerResponse, cookies: Record<string, string>): void {
    const cookieStrings = Object.entries(cookies).map(([key, value]) => `${key}=${value}`);

    res.setHeader('Set-Cookie', cookieStrings);
}

export function getCookies(req: TIncomingMessage): Record<string, string> {
    const cookies: Record<string, string> = {};
    const cookieHeader = req.headers.cookie;

    if (cookieHeader) {
        const cookiePairs = cookieHeader.split(';');

        for (const pair of cookiePairs) {
            const [key, value] = pair.split('=').map(part => part.trim());
            cookies[key] = value;
        }
    }

    return cookies;
}

export function setHeaders(res: TServerResponse, headers: Record<string, string>): void {
    for (const [key, value] of Object.entries(headers)) {
        res.setHeader(key, value);
    }
}

export function getHeaders(req: TIncomingMessage): Record<string, string> {
    const headers: Record<string, string> = {};

    for (const [key, value] of Object.entries(req.headers)) {
        headers[key] = value as string;
    }

    return headers;
}


export function getIP(req: TIncomingMessage): string {
    const raw = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

    return (Array.isArray(raw) ? raw[0] : raw).split(',')[0].trim();
}