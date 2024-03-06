import dotenv from 'dotenv';
dotenv.config();

export default {
  BACKEND_PORT: parseInt(process.env.BACKEND_PORT),
  FILE_EXPIRY: parseInt(process.env.FILE_EXPIRY),
  FILE_SIZE: parseInt(process.env.FILE_SIZE),
  FS_FOLDER: process.env.FS_FOLDER,
  JWT_EXPIRY: parseInt(process.env.JWT_EXPIRY),
  TOTP_SECRET: process.env.TOTP_SECRET,
  ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
  SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
  REGION: process.env.REGION,
  DOMAIN: process.env.DOMAIN,
  ORIGIN_ID: process.env.ORIGIN_ID,
};
