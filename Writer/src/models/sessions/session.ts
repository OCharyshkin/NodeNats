import SessionChunk from "./session-chunk";

class Session {

    public lastWrittenChunkSequence: number = -1;

    private chunksToProcess: SessionChunk[] = [];

    public fileName: string = '';

    public fullFileName: string = '';

    public fileCreated: boolean = false;

    constructor(public id: string) {

    }

    public addChunkToProcess(chunk: SessionChunk) {

        this.chunksToProcess.push(chunk);

        this.chunksToProcess.sort((c1, c2) => c2.sequence - c1.sequence);
    }

    public getNextChunkToProcess(): SessionChunk | null {

        if (this.chunksToProcess.length === 0) {
            return null;
        }

        return this.chunksToProcess[this.chunksToProcess.length - 1];
    }

    public removeNextChunkToProcess(): void {
        this.chunksToProcess.pop();
    }

}

export default Session;