import type {TIncomingMessage, TRoute, TServerResponse} from "@Types/HttpClient";
import {Response} from "@Utils/Http";

export default class PingRoute implements TRoute {
    method = 'GET';
    path = '/ping';

    async execute(req: TIncomingMessage, res: TServerResponse) {
        return Response(res, {
            status: 200,
            message: 'Hello, world!'
        });
    }
}