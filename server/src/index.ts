import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import {connectDB} from "./config/db.js";
import {ENV} from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from './routes/product.routes.js';



const app = new Hono()
app.use('*', cors())
app.route('/api/v1/auth', authRoutes);
app.route('/api/v1/products', productRoutes);

app.get('/', (c) => {
    return c.json({
        message: 'Hello, Hono with CORS!',
    })
})

const startServer = async () => {
    try {

        serve({
            fetch: app.fetch,
            port: Number(ENV.PORT),
        }, async() => {
            await connectDB()
            console.log(`Server is running on http://localhost:${ENV.PORT}`)
        })
    } catch (error) {
        console.error("Failed to start server:", error)
        process.exit(1)
    }
}

startServer()