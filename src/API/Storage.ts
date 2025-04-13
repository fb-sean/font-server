import axios from 'axios';
import path from "path";

class Storage {
    private static _instance: Storage;
    private readonly basePath: string;
    private readonly auth: { username: string; password: string };

    private constructor() {
        this.basePath = process.env.STORAGE_URL! + process.env.STORAGE_PATH!;
        this.auth = {
            username: process.env.STORAGE_USER!,
            password: process.env.STORAGE_PASSWORD!
        };
    }

    public static getInstance(): Storage {
        if (!Storage._instance) {
            Storage._instance = new Storage();
        }

        return Storage._instance;
    }

    public async getFile(file: string): Promise<Buffer | null> {
        try {
            const response = await axios.get(this.basePath + file, {
                responseType: 'arraybuffer',
                auth: this.auth
            });

            return Buffer.from(response.data);
        } catch {
            return null;
        }
    }

    public async writeFile(fileName: string, fileBuffer: Buffer): Promise<void> {
        const fullPath = this.basePath + fileName;
        const dir = path.dirname(fileName);
        const fullDir = this.basePath + dir + '/';

        console.log(fullPath);
        const putResponse = await axios.put(fullPath, fileBuffer, {
            headers: {'Content-Type': 'application/octet-stream'},
            auth: this.auth
        }).catch(e => e.response);

        if (!putResponse) {
            throw new Error('PUT: No response from server.');
        }

        if (putResponse.status === 409) {
            const mkcolResponse = await axios.request({
                method: 'MKCOL',
                url: fullDir,
                auth: this.auth
            }).catch(e => e.response);

            if (!mkcolResponse) {
                throw new Error('MKCOL: No response from server.');
            }

            if (mkcolResponse.status === 201) {
                const putResponse = await axios.put(fullPath, fileBuffer, {
                    headers: {'Content-Type': 'application/octet-stream'},
                    auth: this.auth
                }).catch(e => e.response);

                if (!putResponse) {
                    throw new Error('PUT: No response from server.');
                }
            }
        }
    }
}

export default Storage;