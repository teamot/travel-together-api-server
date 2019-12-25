import { config } from 'dotenv';
import { resolve } from 'path';

// 환경변수 세팅
config({
  path: resolve(__dirname, '../env/.env')
});
