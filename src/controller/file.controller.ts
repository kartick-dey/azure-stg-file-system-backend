import { NextFunction, Request, Response } from 'express';
import { FileUploadService } from '../service/file.service';
import { IChunk } from '../model/chunk.interface';
import successHandler from '../utils/successHandler';
import { CustomError } from '../utils/customError';

export class FileUploadController {
    constructor(private svc: FileUploadService) {}

    uploadFileChunkCtrl = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const chunk: IChunk = {
                file: req.file,
                chunkIndex: parseInt(req.body.chunkIndex),
                fileName: req.body.fileName,
                totalChunks: parseInt(req.body.totalChunks),
                storageOption: req.body.storageOption || 'Directory',
            };
            const result = await this.svc.uploadFileChunkSvc(chunk);
            return successHandler(res, 'Chunk uploaded successfully', result);
        } catch (error) {
            next(error);
        }
    };

    downloadFileFromDirectory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const fileId = req.params?.id?.toString() || '';
            if (!fileId) {
                throw new CustomError('File id is required to download', 403);
            }
            await this.svc.downloadFileFromDirectory(res, fileId);
        } catch (error) {
            next(error);
        }
    };
}
