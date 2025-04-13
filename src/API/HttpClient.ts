import * as http from "node:http";
import type {
    TIncomingMessage,
    TMiddlewareHandler,
    TMiddlewareNext,
    TMiddlewares,
    TRouteHandler,
    TRoutes,
    TServerResponse
} from "@Types/HttpClient";
import {getParams, Response} from "@Utils/Http";
import Logger from "@Utils/Logger";

export class HttpClient {
    private _routes: TRoutes = {};
    private _routesList: string[] = [];
    private _globalMiddlewares: TMiddlewareHandler[] = [];
    private _routeMiddlewares: TMiddlewares = {};

    add(method: string, route: string, callback: TRouteHandler): void {
        method = method.toUpperCase();

        if (!this._routes[method]) {
            this._routes[method] = {};
        }

        if (!this._routesList.includes(route)) {
            this._routesList.push(route);
        }

        this._routes[method][route] = callback;
    }

    addRouteMiddleware(route: string, middleware: TMiddlewareHandler): void {
        if (!this._routeMiddlewares[route]) {
            this._routeMiddlewares[route] = [];
        }

        this._routeMiddlewares[route].push(middleware);
    }

    addGlobalMiddleware(middleware: TMiddlewareHandler): void {
        this._globalMiddlewares.push(middleware);
    }

    listen(port: number): void {
        const server = http.createServer(async (req: TIncomingMessage, res: TServerResponse) => {
            res.cameInAt = Date.now();

            const method = req.method?.toUpperCase() || '';
            const fullUrl = req.url || '';
            req.path = new URL(fullUrl, `https://${req.headers.host}`).pathname;

            Logger.debug(`${method} ${fullUrl}`, 'HTTP');

            if (method === 'POST' || method === 'PUT') {
                try {
                    (req).body = await this.parseRequestBody(req);
                } catch (error) {
                    res.statusCode = 400;
                    res.end('Invalid JSON');
                    return;
                }
            }

            if (this._globalMiddlewares.length > 0) {
                if (!(await this.handleMiddlewares(this._globalMiddlewares, req, res))) return;
            }

            if (this._routeMiddlewares[req.path]) {
                if (!(await this.handleMiddlewares(this._routeMiddlewares[req.path], req, res))) return;
            }

            if (this._routes[method]?.[req.path]) {
                return this._routes[method][req.path](req, res);
            }

            if (this._routes[method]) {
                for (const route in this._routes[method]) {
                    const routeParts = route.split('/').filter(Boolean);
                    const urlParts = req.path.split('/').filter(Boolean);

                    const params: Record<string, string> = {};
                    let matched = true;

                    for (let i = 0; i < routeParts.length; i++) {
                        const r = routeParts[i];
                        const u = urlParts[i];

                        if (r === '*') {
                            params['wildcard'] = urlParts.slice(i).join('/');
                            break;
                        }

                        if (!u) {
                            matched = false;
                            break;
                        }

                        if (r.startsWith(':')) {
                            params[r.slice(1)] = u;
                        } else if (r !== u) {
                            matched = false;
                            break;
                        }
                    }

                    if (matched) {
                        req.params = params;
                        return this._routes[method][route](req, res);
                    }
                }
            }

            return Response(res, {status: 404, message: 'Not Found'}, 404);
        });

        server.listen(port, () => {
            Logger.info(`Server listening on port ${port}`, 'HTTP');
        });
    }

    private async handleMiddlewares(middlewares: TMiddlewareHandler[], req: TIncomingMessage, res: TServerResponse): Promise<boolean> {
        for (const middleware of middlewares) {
            const proceed = await new Promise<boolean>(resolve => middleware(req, res, resolve as TMiddlewareNext));
            if (!proceed) return false;
        }

        return true;
    }

    private async parseRequestBody(req: TIncomingMessage): Promise<any> {
        return new Promise((resolve, reject) => {
            let body = '';

            req.on('data', chunk => {
                body += chunk;
            });

            req.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (error) {
                    resolve(body);
                }
            });

            req.on('error', reject);
        });
    }
}

export default function createHttpClient(): HttpClient {
    return new HttpClient();
}