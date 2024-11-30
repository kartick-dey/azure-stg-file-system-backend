import { Router } from 'express';
import configRouter from './config.router';
import fileUploadRouter from './file.router';

const rootRouters = Router();

rootRouters.use('/v1/config', configRouter);
rootRouters.use('/v1/file', fileUploadRouter);

export default rootRouters;
