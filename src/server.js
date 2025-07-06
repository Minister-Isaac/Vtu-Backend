import express from "express";
import helmet from "helmet";
import logger from "./utils/logger.js";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/error.handler.js";
import { requestLogger } from "./middleware/request.logger.js";
import { connectToDb } from "./config/db.config.js";
import authRoutes from "./routes/auth.route.js";
import accountRoutes from "./routes/account.route.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ Allow cross-origin requests with credentials
app.use(cors({
  origin: "http://localhost:3000", // React frontend
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Middleware
app.use(requestLogger);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/subscribe", accountRoutes);

// ✅ Global error handler
app.use(errorHandler);

// ✅ Start server
app.listen(process.env.PORT, async () => {
  await connectToDb();
  logger.info(`Server is running in ${process.env.NODE_ENV} environment on port ${process.env.PORT}`);
});

// ✅ Graceful shutdown handlers
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception", error);
  process.exit(1);
});
