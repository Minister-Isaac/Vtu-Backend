import express from "express"
import helmet from "helmet"
import logger from "./utils/logger.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import errorHandler from "./middleware/error.handler.js"
import { requestLogger } from "./middleware/request.logger.js"
import { connectToDb } from "./config/db.config.js"
import authRoutes from "./routes/auth.route.js"
import accountRoutes from "./routes/account.route.js"
import dotenv from "dotenv"
dotenv.config()

const app = express()
app.use(requestLogger)

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
}))
app.use(helmet())
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the API and server is running on port 5000",
    status: "success"
  })
})
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/subscribe", accountRoutes)
app.use(errorHandler)

app.listen(process.env.PORT, async () => {
    await connectToDb()
    logger.info(`Server is running in ${process.env.NODE_ENV} environment`)
})

process.on("unhandledRejection", (reason, promise) => {
  logger.error("unhandled Rejection at:", promise, "reason:", reason)
  process.exit(1)
})

process.on("uncaughtException", (error) => {
  logger.error("uncaughtException", error)
  process.exit(1)
})
