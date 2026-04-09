import type {TIncomingMessage, TRoute, TServerResponse} from "@Types/HttpClient";
import FetchRoute from "../fetch";

const fetchRoute = new FetchRoute();

export default class SRoute implements TRoute {
    method = 'GET';
    path = '/s/*';

    async execute(req: TIncomingMessage, res: TServerResponse) {
        return fetchRoute.execute(req, res);
    }
}