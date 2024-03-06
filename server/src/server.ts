import { routes } from './routes';
import express, { Response, NextFunction } from 'express';
import { FsUtils } from './fs';
import bodyParser from 'body-parser';
import cors from 'cors';
import config from './config';

FsUtils.init();

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(routes);

app.use((error, req, res, next) => {
  return res.status(400).json({ message: error?.message ?? 'Failure' });
});

app.use(express.static('public'));

const PORT = config.BACKEND_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Application started on port ${PORT}!`);
});
