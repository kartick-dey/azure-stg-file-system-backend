import { BlockBlobClient } from '@azure/storage-blob';
import { IChunk } from '../model/chunk.interface';
import { CustomError } from './customError';
import * as path from 'path';
import fsExtra from 'fs-extra';
import * as fs from 'fs';

export class FileUtils {
    constructor() {}

    static async uploadFileInAzureBlobStorage(chunk: IChunk) {
        try {
            const { file, chunkIndex, totalChunks, fileName } = chunk;
            const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || '';
            const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || '';

            const blockBlobClient = new BlockBlobClient(connectionString, containerName, fileName);

            // Upload the chunk
            await blockBlobClient.stageBlock(
                `block${chunkIndex.toString().padStart(6, '0')}`, // Block ID
                file,
                file.size,
            );

            // Commit blocks if all chunks are uploaded
            if (chunkIndex === totalChunks - 1) {
                const blockList = Array.from(
                    { length: totalChunks },
                    (_, index) => `block${index.toString().padStart(6, '0')}`,
                );
                await blockBlobClient.commitBlockList(blockList);
                return 'File uploaded successfully';
            }
            return 'Chunk uploaded successfully';
        } catch (error: any) {
            throw new CustomError(error.message || 'File to upload file in Azure Blob Storage', 500);
        }
    }

    // Method for uploading chunked file
    static async uploadFileInDirectory(chunk: IChunk) {
        try {
            const uploadDir = path.join(__dirname, '../../dist/uploads');
            // Ensure the upload directory exists
            await fsExtra.ensureDir(uploadDir);
            let msg: string;
            msg = FileUtils.createFile(chunk, uploadDir);
            return msg;
        } catch (error: any) {
            throw new CustomError(error.message || 'Failed to upload file in Directory', 500);
        }
    }

    static createFile(chunk: IChunk, uploadDir: string) {
        try {
            let msg: string = '';
            const { file, fileName, chunkIndex, totalChunks } = chunk;

            const filePath = path.join(uploadDir, fileName);
            const chunkData = file.buffer;

            // Append the chunk to the file
            fs.open(filePath, 'a', (err, fd) => {
                if (err) {
                    return new CustomError('Error opening file', 500);
                }
                fs.write(fd, chunkData, 0, chunkData.length, null, (err) => {
                    if (err) {
                        return new CustomError('Error writing chunk', 500);
                    }
                    fs.close(fd, () => {
                        // If this is the last chunk, we can return a completion message
                        if (chunkIndex === totalChunks - 1) {
                            msg = 'File upload completed';
                        } else {
                            msg = 'Chunk uploaded successfully';
                        }
                    });
                });
            });
            return msg;
        } catch (error: any) {
            throw new CustomError(error.message || 'Failed to upload', 500);
        }
    }
}
