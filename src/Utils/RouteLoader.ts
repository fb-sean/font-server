import {HttpClient} from "@API/HttpClient";
import type {TRoute} from "@Types/HttpClient";
import fs from "fs";
import path from "path";
import Logger from "@Utils/Logger";

export async function loadRoutes(app: HttpClient) {
    const loadRoutesFromDir = (dir: string) => {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.lstatSync(fullPath);

            if (stat.isDirectory()) {
                loadRoutesFromDir(fullPath);
            } else if (file.endsWith('.ts') || file.endsWith('.js')) {
                const RouteClass = require(fullPath).default;

                if (RouteClass) {
                    const route: TRoute = new RouteClass();

                    app.add(
                        route.method.toUpperCase(),
                        route.path,
                        async (req, res) => await route.execute(req, res)
                    );

                    Logger.info(`Loaded route ${route.method.toUpperCase()} ${route.path}`, 'ROUTES');
                }
            }
        }
    };

    loadRoutesFromDir(path.join(__dirname, "../Routes"));
}
