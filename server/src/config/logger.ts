import winston from "winston";
import fs from "fs";
import path from "path";

// ========= Custom log formatter =========
const logFormat = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}] ${message}`;

  if (Object.keys(metadata).length > 0) {
    let seen = new WeakSet();
    try {
      const cleanedMetadata = JSON.parse(
        JSON.stringify(metadata, (key, value) => {
          if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
              return "[Circular]";
            }
            seen.add(value);
          }
          return value;
        })
      );
      msg += ` | ${JSON.stringify(cleanedMetadata)}`;
    } catch (error) {
      msg += ` | [Metadata Error: ${
        error instanceof Error ? error.message : "Unknown"
      }]`;
    }
  }

  return msg;
});

// ========= Log directory handling =========
let logs = process.env.LOGS_DIR || "/tmp/logs";

try {
  if (!fs.existsSync(logs)) {
    fs.mkdirSync(logs, { recursive: true });
    console.info(`✅ Created logs directory at: ${logs}`);
  } else {
    console.info(`📂 Logs directory already exists: ${logs}`);
  }
} catch (err) {
  console.warn(
    `⚠️ Could not create logs directory at ${logs}, falling back to console only.`,
    err
  );
  logs = null; // disable file logging
}

// ========= Winston logger =========
export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.colorize(),
    logFormat
  ),
  transports: [
    // Always log to console
    new winston.transports.Console({
      handleExceptions: true,
      handleRejections: true,
    }),

    // Log to files if writable
    ...(logs
      ? [
          new winston.transports.File({
            filename: path.join(logs, "error.log"),
            level: "error",
            handleExceptions: true,
          }),
          new winston.transports.File({
            filename: path.join(logs, "combined.log"),
            handleRejections: true,
          }),
        ]
      : []),
  ],
  exitOnError: false,
});

// ========= Morgan stream =========
export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim()); // use http level for request logs
  },
};

// ========= Safety hooks =========
logger.on("error", (error) => {
  console.error("❌ Winston logger internal error:", error);
});

process.on("unhandledRejection", (reason) => {
  logger.error("💥 Unhandled Rejection", { reason });
});

process.on("uncaughtException", (error) => {
  logger.error("🔥 Uncaught Exception", { error });
});
