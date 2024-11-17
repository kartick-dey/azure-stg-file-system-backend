import { parentPort } from 'worker_threads';
import { IChunk } from '../model/chunk.interface';
import { FileUtils } from '../utils/fileUtils';

parentPort?.on('message', async (chunk: IChunk) => {
    try {
        console.log('Worker started executing...');
        let data;
        const { storageOption, chunkIndex, totalChunks } = chunk;
        if (storageOption === 'Azure') data = await FileUtils.uploadFileInAzureBlobStorage(chunk);
        else data = FileUtils.uploadFileInDirectory(chunk);
        const result =
            chunkIndex === totalChunks - 1
                ? {
                      success: true,
                      message: data,
                  }
                : {
                      success: true,
                      chunkIndex: chunkIndex,
                      totalChunks: totalChunks,
                      message: data,
                  };
        parentPort?.postMessage(result);
    } catch (error: any) {
        parentPort?.postMessage({ error: true, message: error.message || 'Failed to upload file/chunk' });
    } finally {
        console.log('Worker execution done...');
    }
});
