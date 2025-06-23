import express from "express"
import {ENV} from "./config/env.js"
import { connectDB } from "./config/db.js"
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan('dev'))
app.use(helmet())
app.use(cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
}))

app.listen(ENV.PORT, () => {
    connectDB();
    console.log(`Server is running on port ${ENV.PORT}`)
})
