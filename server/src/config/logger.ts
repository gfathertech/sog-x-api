import winston from "winston";

// Define log format with colorization
const logFormat = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}] ${message}`;
  
  if (Object.keys(metadata).length > 0) {
    // Handle circular structures in metadata
    let seen = new WeakSet();
    try {
      const cleanedMetadata = JSON.parse(JSON.stringify(metadata, (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
            // Circular reference found, discard key
            return '[Circular]';
          }
          seen.add(value);
        }
        return value;
      }));
      msg += ` | ${JSON.stringify(cleanedMetadata)}`;
    } catch (error) {
      msg += ` | [Metadata Error: ${error instanceof Error ? error.message : 'Unknown'}]`;
    }
  }
  
  return msg;
});

 let  logs = process.env.LOGS || '/tmp/logs';
// Create logger instance
export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize(),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: `${logs}/error.log`,
      level: "error",
      handleExceptions: true
    }),
    new winston.transports.File({
      filename: `${logs}/combined.log`,
      handleRejections: true
    })
  ],
  exitOnError: false
});

// Create separate Morgan stream
export const morganStream = {
  write: (message: string) => {
    logger.info(message.trim());
  }
};

// Add error handling
logger.on('error', (error) => {
  console.error('Logger error:', error);
});