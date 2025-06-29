import express from "express"
import {ENV} from "./config/env.js"
import {connectDB} from "./config/db.js"
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import authRoute from "./routes/auth.route.js";
import categoryRouter from "./routes/category.route.js";
import productRoute from "./routes/product.route.js";
import cartRouter from "./routes/cart.route.js";
import orderRouter from "./routes/order.route.js";

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(morgan('dev'))
app.use(helmet())
app.use(cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
}))

app.use("/api/v1/auth", authRoute)
app.use("/api/v1/product", productRoute)
app.use("/api/v1/category", categoryRouter)
app.use("/api/v1/cart", cartRouter)
app.use("/api/v1/order", orderRouter)


app.listen(ENV.PORT, () => {
    connectDB();
    console.log(`Server is running on port ${ENV.PORT}`)
})
