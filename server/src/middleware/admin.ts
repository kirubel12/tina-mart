import { createMiddleware } from "hono/factory"

// Admin and Vendor middleware
const adminMiddleware = createMiddleware(async (c, next) => {
  const user = c.get('user')
  if (user.role !== 'admin' && user.role !== 'vendor') {
    return c.json({ error: 'Admin or Vendor access required' }, 403)
  }
  await next()
})

export default adminMiddleware
