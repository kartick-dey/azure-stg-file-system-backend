import * as path from 'path';
import { IChunk } from '../model/chunk.interface';
import { CustomError } from '../utils/customError';
import { Worker } from 'worker_threads';
import { FileUtils } from '../utils/fileUtils';

export class FileUploadService {
    constructor() {}

    uploadFileChunkThreadSvc = (chunk: IChunk) => {
        try {
            // Initialize worker for chunk upload
            const workerFilePath = path.join(__dirname, '../../dist/workers/fileUpload.worker.js');
            console.log('workerFilePath:', workerFilePath);
            const worker = new Worker(workerFilePath);
            // pass the chunk to worker
            worker.postMessage(chunk);
            // Listen the message from worker
            worker.on('message', (message) => {
                if (message.sucess) {
                    return message;
                } else {
                    throw new CustomError(message.message, 500);
                }
            });
            // Listen the error from worker
            worker.on('error', (error) => {
                throw new CustomError(error.message, 500);
            });
        } catch (error: any) {
            throw new CustomError(error.message || 'Faild to upload chunk', 500);
        }
    };

    uploadFileChunkSvc = async (chunk: IChunk) => {
        try {
            let message: string;
            const { storageOption } = chunk;
            if (storageOption === 'Azure') message = await FileUtils.uploadFileInAzureBlobStorage(chunk);
            else message = await FileUtils.uploadFileInDirectory(chunk);
            return { success: true, message: message };
        } catch (error: any) {
            throw new CustomError(error.message || 'Faild to upload chunk', 500);
        }
    };
}
