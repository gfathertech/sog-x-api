// index.ts (heavy logging, diagnostics)
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { v1Routes } from "./routes/v1Route";
import authRouter from "./auth/userRoutes";
import { morganStream, logger } from "./config/logger";
import { db } from "./config/db";

dotenv.config();

const app: Express = express();

// FORCE HF preferred port by default to 7860
const PORT: number = parseInt(process.env.PORT || '7860', 10);

// Utility: mask secret values for safe logging
function maskValue(s?: string | null) {
  if (!s) return "<MISSING>";
  const keep = 4;
  if (s.length <= keep) return "*".repeat(s.length);
  return s.slice(0, keep) + "...(" + s.length + " chars)";
}

// Very noisy environment dump (keys only, masked values)
const importantKeys = [
  "PORT",
  "NODE_ENV",
  "MONGO_URI",
  "CLIENT_URL",
  "GH_TOKEN",
  "LOGS_DIR"
];

console.group("🧭 ENVIRONMENT DIAGNOSTIC");
importantKeys.forEach(k => {
  const val = process.env[k as keyof NodeJS.ProcessEnv];
  console.log(`${k}: ${maskValue(val ?? null)}`);
});
console.log("Process uid/gid:", process.getuid?.(), process.getgid?.());
console.groupEnd();

// Startup time measurement
const startTime = Date.now();
logger.info("== Starting application (heavy diagnostics) ==");
console.info("== Starting application (heavy diagnostics) ==");

// DB connection attempt instrumentation
try {
  logger.info("-> Attempting DB connect (db() will log details)");
  db()
    .then?.(() => {
      logger.info("✅ DB connection (promise resolved) or DB init called.");
    })
    .catch?.((err: any) => {
      logger.error("❌ DB connection error (caught):", { message: err?.message ?? err, stack: err?.stack });
      console.error("DB connection error (caught):", err);
    });
} catch (err) {
  logger.error("❌ DB connection threw sync error:", { error: err instanceof Error ? err.message : String(err) });
  console.error("DB connect threw:", err);
}

// Middlewares: intensive logging
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true
}));
app.use(express.json({ limit: "2mb" })); // protect with size
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(cookieParser());

// morgan to logger (detailed)
app.use(morgan("combined", { stream: morganStream }));

// extra: request/response body logger (size-limited, safe)
app.use((req: Request, res: Response, next) => {
  const start = Date.now();
  // capture a snapshot of the body (stringify safe)
  let bodyPreview: string | undefined = undefined;
  try {
    if (req.body) {
      const s = JSON.stringify(req.body);
      bodyPreview = s.length > 1000 ? s.slice(0, 1000) + " ...[truncated]" : s;
    }
  } catch (e) {
    bodyPreview = "[unserializable body]";
  }

  logger.debug(`REQ START ${req.method} ${req.url}`, {
    headers: Object.keys(req.headers).slice(0, 20),
    bodyPreview
  });

  // intercept finish to log response time
  res.on("finish", () => {
    const ms = Date.now() - start;
    logger.info(`REQ DONE ${req.method} ${req.url} ${res.statusCode} ${ms}ms`, {
      route: req.url
    });
  });

  next();
});

// Basic health endpoints
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

app.get("/", (_req: Request, res: Response) => {
  res.json({
    status: "200",
    data: "Backend is responding",
    pid: process.pid,
    startedAtMs: startTime
  });
});

// Routes registration
app.use("/api/auth", authRouter);
v1Routes(app);

// 404 handler (logs)
app.use((req, res) => {
  logger.warn(`404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Error handler with huge logging
app.use((err: any, _req: Request, res: Response, _next: any) => {
  const errMsg = err?.message ?? String(err);
  const errStack = err?.stack ?? "no-stack";
  logger.error("Uncaught error in request handler", { message: errMsg, stack: errStack });
  console.error("Uncaught error in request handler", err);
  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

// Global handlers (catch-all)
process.on("uncaughtException", (err) => {
  logger.error("GLOBAL uncaughtException", { message: err?.message ?? String(err), stack: err?.stack });
  console.error("GLOBAL uncaughtException", err);
  // do not exit immediately - allow HF to capture logs; optionally exit
});

process.on("unhandledRejection", (reason) => {
  logger.error("GLOBAL unhandledRejection", { reason: typeof reason === "object" ? JSON.stringify(reason) : String(reason) });
  console.error("GLOBAL unhandledRejection", reason);
});

// Signal handlers to log shutdown reasons
["SIGINT", "SIGTERM", "SIGHUP"].forEach(sig => {
  process.on(sig as NodeJS.Signals, () => {
    logger.warn(`Received signal ${sig} - shutting down gracefully`);
    console.warn(`Received signal ${sig} - shutting down gracefully`);
    process.exit(0);
  });
});

// Start listening and verbose startup logs
app.listen(PORT, () => {
  const readyAt = Date.now();
  const tookMs = readyAt - startTime;
  logger.info(`✅ Server has started at http://0.0.0.0:${PORT} (took ${tookMs}ms)`);
  console.info(`✅ Server has started at http://0.0.0.0:${PORT} (took ${tookMs}ms)`);
  // log which logs dir is used
  console.info("LOGS_DIR (effective):", process.env.LOGS_DIR || "<unset, default /tmp/logs>");
  logger.info("LOGS_DIR (effective)", { logsDir: process.env.LOGS_DIR || "/tmp/logs" });

  // print active handles count (helps detect immediate exit)
  const activeHandles = (process as any)._getActiveHandles?.().length ?? "unknown";
  const activeRequests = (process as any)._getActiveRequests?.().length ?? "unknown";
  console.info("Active handles count (internal):", activeHandles);
  console.info("Active requests count (internal):", activeRequests);
});
