import fs from 'fs/promises';
import path from 'path';

class InternalStorage {
    private static _instance: InternalStorage;
    private readonly basePath: string;

    private constructor() {
        this.basePath = path.resolve(__dirname, '../fonts');
    }

    public static getInstance(): InternalStorage {
        if (!InternalStorage._instance) {
            InternalStorage._instance = new InternalStorage();
        }

        return InternalStorage._instance;
    }

    public async getFile(fileName: string): Promise<Buffer | null> {
        try {
            const filePath = path.join(this.basePath, fileName);
            return await fs.readFile(filePath);
        } catch {
            return null;
        }
    }

    public async writeFile(fileName: string, fileBuffer: Buffer): Promise<void> {
        const fullPath = path.join(this.basePath, fileName);
        const dir = path.dirname(fullPath);

        await fs.mkdir(dir, {recursive: true});
        await fs.writeFile(fullPath, fileBuffer);
    }
}

export default InternalStorage;