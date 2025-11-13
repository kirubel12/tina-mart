import { createMiddleware } from "hono/factory"

// Admin-only middleware
const adminMiddleware = createMiddleware(async (c, next) => {
  const user = c.get('user')
  if (user.role !== 'admin') {
    return c.json({ error: 'Admin access required' }, 403)
  }
  await next()
})

export default adminMiddleware
