import IFileWriter from "./file-writer.interface";

const fs = require('fs');

class FileWriter implements IFileWriter{

    async append(fileName: string, data: string): Promise<void> {

        return new Promise<void>((res, rej) => {
            fs.appendFile(fileName, data, (err: any) => {
                if (err){
                    rej(err);
                    return;
                }

                res();
            });
        });
    }

    async create(fileName: string): Promise<void> {

        return new Promise<void>((res, rej) => {
            fs.open(fileName, 'w', (err: any) => {
                if (err){
                    rej(err);
                    return;
                }

                res();
            });
        });
    }
}

export default FileWriter;