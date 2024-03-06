import express from 'express';
import { uploadRoute } from './upload';

export const routes = express.Router();

routes.use(uploadRoute);
