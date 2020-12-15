import express from 'express';
import * as authorController from '../controllers/authors.js';

export const authorRoutes = express.Router();

authorRoutes.get('/all',authorController.getAuthors);

authorRoutes.get('/:id',authorController.getAuthorbyID);