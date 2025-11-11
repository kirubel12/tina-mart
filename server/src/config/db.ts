import * as mongoose from "mongoose";
import {ENV} from "./env.js";


export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(ENV.MONGO_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (e) {
        console.error(`Error: ${(e as Error).message}`);
        process.exit(1);

    }
}