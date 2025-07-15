import winston from 'winston';
import path from 'path';

const logDir = path.resolve(process.cwd(), 'logs');
const logFile = path.join(logDir, 'api.log');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
  ),
  transports: [
    new winston.transports.File({ filename: logFile })
  ],
});

export { logger }; 