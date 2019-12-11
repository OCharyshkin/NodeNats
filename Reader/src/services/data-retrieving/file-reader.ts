import IFileReader from "./file-reader.interface";
import * as fs from "fs";

class FileReader implements IFileReader {

    read(fileName: string, onChunkRead: (chunk: Buffer) => void, onEnd: () => void): void {
        const readStream = fs.createReadStream(fileName);

        readStream
            .on('data', onChunkRead)
            .on('end', onEnd);
    }

}

export default FileReader;