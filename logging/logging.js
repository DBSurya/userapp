const winston = require('winston');
require('winston-daily-rotate-file');
const config = require("config");
 
const logFormat = winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.printf(
         info => `${info.timestamp}  ${info.level} :  ${info.message}`,
       ),
    );

const insert_transport = new winston.transports.File(
        {
        filename:config.get("insertlog.logFolder") +      config.get("insertlog.logFile")
        }
        );
const delete_transport = new winston.transports.File(
        {
                filename:config.get("deletelog.logFolder") +      config.get("deletelog.logFile")
        }
);
    
const transport =  new winston.transports.DailyRotateFile({
        filename: config.get("logConfig.logFolder") +      config.get("logConfig.logFile"),
        datePattern: 'DD-MM-YYYY',
        maxSize: '20m',
        maxFiles: '14d'
      });
    
const logger = winston.createLogger({
        format: logFormat,
        transports: [
             transport,
             new winston.transports.Console()
        ]});

const insertlog = winston.createLogger({
        transports: [
             insert_transport
]});

const deletelog = winston.createLogger({
        transports: [
             delete_transport
]});

module.exports.logger = logger;
module.exports.insertlog=insertlog;
module.exports.deletelog=deletelog;