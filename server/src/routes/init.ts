import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import config from '../config';
import { AWSCustomService } from '../aws';
import { v4 as uuidv4 } from 'uuid';
export const initRoute = express.Router();

initRoute.use(
  bodyParser.raw({ limit: config.FILE_SIZE, type: 'application/octet-stream' })
);

const acs = new AWSCustomService(config.ACCESS_KEY_ID, config.SECRET_ACCESS_KEY, config.REGION);

//write a route to handle the file transfer initiation, it should accept a GET request and read the parameters filesize and chunksCount from the query string and then calls createCloudFrontDomain to then finally return as many generated domains as required to upload all the chunks
initRoute.get('/init', async (req: Request, res: Response) => {
  const fileSize = parseInt(req.query.fileSize as string);
  const transferId = uuidv4();
  const chunksCount = parseInt(req.query.chunksCount as string);
  const domains: string[] = await Promise.all(Array.from({ length: chunksCount }, (_, i) => {
    return acs.createCloudFrontDomain(config.DOMAIN, config.ORIGIN_ID);
  }));
  acs.createS3Bucket(transferId, config.REGION);
  res.json({ transferId: transferId, domains: domains });
});
