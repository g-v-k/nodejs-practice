import * as express from 'express';
import * as fileUploadController from '../controllers/fileTransfer.js';

export const fileTransferRoutes = express.Router();

fileTransferRoutes.post('',fileUploadController.postFileUpload);

fileTransferRoutes.get('',fileUploadController.getFile);