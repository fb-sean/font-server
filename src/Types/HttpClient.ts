import * as http from "node:http";

export type TIncomingMessage = http.IncomingMessage & {
    path?: string;
    params?: {
        [key: string]: string;
    };
    body?: {
        [key: string]: any;
    };
    isMasterToken?: boolean;
};

export type TServerResponse = http.ServerResponse & {
    cameInAt?: number;
};

export type TMiddlewareNext = (proceed?: boolean) => void;

export type TMiddlewareHandler = (req: TIncomingMessage, res: TServerResponse, next: TMiddlewareNext) => Promise<void>;
export type TRouteHandler = (req: TIncomingMessage, res: TServerResponse) => Promise<void>;

export type TRoutes = {
    [method: string]: {
        [route: string]: TRouteHandler;
    };
};

export type TMiddlewares = {
    [route: string]: TMiddlewareHandler[];
};

export type TRoute = {
    method: string;
    path: string;
    execute: TRouteHandler;
};

export type Middleware = {
    path?: string;
    global?: boolean;
    execute: TMiddlewareHandler;
};