import {HttpClient} from "@API/HttpClient";
import type {Middleware} from "@Types/HttpClient";
import fs from "fs";
import path from "path";
import Logger from "@Utils/Logger";

export async function loadMiddlewares(app: HttpClient) {
    const loadRoutesFromDir = (dir: string) => {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.lstatSync(fullPath);

            if (stat.isDirectory()) {
                loadRoutesFromDir(fullPath);
            } else if (file.endsWith('.ts') || file.endsWith('.js')) {
                const MiddlewareClass = require(fullPath).default;

                if (MiddlewareClass) {
                    const middleware: Middleware = new MiddlewareClass();

                    if (middleware?.global) {
                        app.addGlobalMiddleware(async (req, res, next) => await middleware.execute(req, res, next))
                    } else if (middleware.path) {
                        app.addRouteMiddleware(middleware.path, async (req, res, next) => await middleware.execute(req, res, next))
                    } else if (!middleware.global && !middleware.path) {
                        Logger.warn(`Middleware ${middleware.constructor.name} does not have a path or global flag set`, 'MIDDLEWARES');
                    }

                    Logger.info(`Loaded middleware ${middleware.constructor.name}`, 'MIDDLEWARES');
                }
            }
        }
    };

    loadRoutesFromDir(path.join(__dirname, "../Middlewares"));
}
