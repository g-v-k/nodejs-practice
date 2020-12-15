import express from 'express';
import * as bookController from '../controllers/books.js';

export const bookRoutes = express.Router();

bookRoutes.get('/all',bookController.getBooks);
bookRoutes.get('/:id',bookController.getBookByID);