"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFile = exports.postFileUpload = void 0;
exports.postFileUpload = (req, res, next) => {
    res.status(200).json({
        dataUpload: 'done'
    });
};
exports.getFile = (req, res, next) => {
    res.sendFile('/home/vamsi/Downloads/nodejs-practice/images/video.avi');
};
