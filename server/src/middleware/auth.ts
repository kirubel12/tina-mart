import { createMiddleware } from 'hono/factory'
import { verify } from 'hono/jwt'
import { ENV } from '../config/env.js'

const authMiddleware = createMiddleware(async (c, next) => {
    const token = c.req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
        return c.json({ error: 'Authentication required' }, 401)
    }

    try {
        const payload = await verify(token, ENV.JWT_SECRET)
        c.set('user', payload)
        await next()
    } catch (error) {
        return c.json({ error: 'Invalid token' }, 401)
    }
})

export default authMiddleware