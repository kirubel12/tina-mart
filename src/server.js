

import express from "express"
import {ENV} from "./config/env.js"
import { connectDB } from "./config/db.js"

const app = express()



app.listen(ENV.PORT, () => {
    connectDB();
    console.log(`Server is running on port ${ENV.PORT}`)
})
