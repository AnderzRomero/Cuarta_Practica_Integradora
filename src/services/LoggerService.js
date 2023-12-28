import winston from 'winston';
import config from '../config/config.js';


export default class LoggerService {
  constructor(env) {
    this.options = {
      levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
      }
    }
    this.logger = this.createLogger(env);
  }

  createLogger = (env) => {
    switch (config.app.LOGGER) {
      case "development":
        return winston.createLogger({
          levels: this.options.levels,
          transports: [
            new winston.transports.Console({
              level: 'debug',
            }),
            new winston.transports.File({
              level: 'error',
              filename: './errorsDEV.log'
            })
          ],
        });

      case "production":
        return winston.createLogger({
          levels: this.options.levels,
          transports: [
            new winston.transports.Console({
              level: 'info',
            }),
            new winston.transports.File({
              level: "error",
              filename: './errorsPROD.log'
            })
          ],
        });
    }
  }
}