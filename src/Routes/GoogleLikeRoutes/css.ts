import type {TIncomingMessage, TRoute, TServerResponse} from "@Types/HttpClient";
import SearchRoute from "../search";

const searchRoute = new SearchRoute();

export default class CssRoute implements TRoute {
    method = 'GET';
    path = '/css';

    async execute(req: TIncomingMessage, res: TServerResponse) {
        return searchRoute.execute(req, res);
    }
}