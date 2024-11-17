export interface IChunk {
    file: any;
    chunkIndex: number;
    totalChunks: number;
    fileName: string;
    storageOption: 'Azure' | 'Directory' | 'GCP' | 'AWS'
}
