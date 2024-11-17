import { Router } from "express";
import configRouter from './config.router';
import fileUploadRouter from './fileUpload.router';

const rootRouters = Router();

rootRouters.use('/v1/config', configRouter);
rootRouters.use('/v1/file-upload', fileUploadRouter)

export default rootRouters;