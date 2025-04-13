import type {Middleware, TIncomingMessage, TMiddlewareNext, TServerResponse} from "@Types/HttpClient";

const allowedOrigins = [
    'http://localhost:8564/',
];

export default class CorsMiddleware implements Middleware {
    global = true;

    async execute(req: TIncomingMessage, res: TServerResponse, next: TMiddlewareNext) {
        const origin = req.headers.origin;
        const referer = req.headers.referer;

        if ((origin && allowedOrigins.includes(origin)) || (referer && allowedOrigins.includes(referer))) {
            res.setHeader('Access-Control-Allow-Origin', String(origin ?? referer));
        } else {
            res.setHeader('Access-Control-Allow-Origin', '*');
        }

        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        next(true);
    }
}