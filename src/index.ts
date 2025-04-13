import dotenv from 'dotenv';
import Logger from "@Utils/Logger";
import {loadMiddlewares} from "@Utils/MiddlewareLoader";
import {loadRoutes} from "@Utils/RouteLoader";
import createHttpClient from "@API/HttpClient";

dotenv.config();

process.env.STARTED_AT = Date.now();

const http = createHttpClient();

loadMiddlewares(http).then(() => {
    Logger.info('Middlewares loaded', 'MIDDLEWARE');
});
loadRoutes(http).then(() => {
    Logger.info('Routes loaded', 'ROUTES');
});

http.listen(Number(process.env.PORT) || 3000);

process.on("unhandledRejection", async (reason, p) => {
    Logger.error(`I got a Unhandled Rejection/Catch`, 'PROCESS');
    console.log(reason, p);
});
process.on("uncaughtException", async (err, origin) => {
    Logger.error(`I got a Uncaught Exception/Catch`, 'PROCESS');
    console.log(err, origin);
});