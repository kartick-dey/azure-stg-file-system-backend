import { NextFunction, Request, Response } from 'express';
import { FileUploadService } from '../service/fileupload.service';
import { IChunk } from '../model/chunk.interface';
import successHandler from '../utils/successHandler';

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
}
