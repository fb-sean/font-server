declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number;

            STARTED_AT: number;

            STORAGE_URL: string;
            STORAGE_PATH: string;
            STORAGE_USER: string;
            STORAGE_PASSWORD: string;
        }
    }
}

export {}