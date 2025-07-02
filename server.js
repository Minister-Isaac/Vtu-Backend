import express from "express"
import helmet from "helmet"
import logger from "./utils/logger"
import errorHandler from "./middleware/error.handler"
import { requestLogger } from "./middleware/request.logger"
import dotenv from "dotenv"
dotenv.config()

const app = express()
app.use(logger)
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(errorHandler)

app.listen(process.env.PORT, () => {
    logger.info("Server is running")
})

process.on("unhandledRejection", (err) => {
    logger.error("Unhandled Rejection:", err)
    logger.info("Environment is in:", process.env.NODE_ENV)
    process.exit(1)
})