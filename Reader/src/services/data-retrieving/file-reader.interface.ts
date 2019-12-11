interface IFileReader {

    read(fileName: string, onChunkRead: (chunk: Buffer) => void, onEnd: () => void): void;
}

export default IFileReader;