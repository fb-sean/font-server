import type {TIncomingMessage, TRoute, TServerResponse} from "@Types/HttpClient";
import {Response, setHeaders} from "@Utils/Http";
import axios from "axios";
import Storage from "@API/InternalStorage";
import {generateEtag, getMimeType} from "@Utils/File";
import Logger from "@Utils/Logger";

export default class FetchRoute implements TRoute {
    method = 'GET';
    path = '/fetch/*';

    async execute(req: TIncomingMessage, res: TServerResponse) {
        const reqUrl = new URL(req.url!, `http://${req.headers.host}`);
        const filePath = decodeURIComponent(reqUrl.pathname.replace(/^\/fetch\//, ''));
        const mime = getMimeType(filePath);

        const cached = await Storage.getInstance().getFile(filePath);
        if (cached) {
            const etag = generateEtag(cached);
            if (req.headers['if-none-match'] === etag) {
                res.statusCode = 304;
                res.end();
                return;
            }

            setHeaders(res, {
                'Content-Type': mime,
                'ETag': etag,
                'Cache-Control': 'public, max-age=31536000, immutable'
            });

            res.end(cached);
            return;
        }

        try {
            Logger.debug('Font not found in cache, fetching from Google Fonts', 'FETCH');

            const url = `https://fonts.gstatic.com/s/${filePath}`;
            const {data} = await axios.get(url, {responseType: 'arraybuffer'});

            await Storage.getInstance().writeFile(filePath, Buffer.from(data));

            const etag = generateEtag(data);
            setHeaders(res, {
                'Content-Type': mime,
                'ETag': etag,
                'Cache-Control': 'public, max-age=31536000, immutable'
            });

            res.end(data);

            Logger.debug('Font saved after fetch.', 'FETCH');
        } catch (e) {
            return Response(res, 'Font not found', 404);
        }
    }
}