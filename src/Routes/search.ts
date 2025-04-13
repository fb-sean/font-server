import type {TIncomingMessage, TRoute, TServerResponse} from "@Types/HttpClient";
import {Response, setHeaders} from "@Utils/Http";
import axios from "axios";

export default class CssRoute implements TRoute {
    method = 'GET';
    path = '/search';

    async execute(req: TIncomingMessage, res: TServerResponse) {
        const query = req.url?.split('?')[1] || '';
        const remoteUrl = `https://fonts.googleapis.com/css?${query}`;

        try {
            const {data} = await axios.get(remoteUrl, {
                headers: {
                    'User-Agent': req.headers['user-agent'] || '',
                }
            });

            const replaced = data.replace(/https:\/\/fonts\.gstatic\.com\/s\/([^\/]+\/[^\/]+\/[^)'" ]+)/g, (process.env.URL + '/fetch/$1'));

            setHeaders(res, {
                'Content-Type': 'text/css; charset=utf-8',
                'Cache-Control': 'public, max-age=3600'
            });

            res.end(replaced);
        } catch {
            return Response(res, 'Failed to fetch stylesheet', 500);
        }
    }
}
