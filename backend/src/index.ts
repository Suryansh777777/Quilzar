import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {decode,sign,verify } from 'hono/jwt'
// whenever you want to use env variables you need to define them in the type of the app
const app = new Hono<{
  Bindings:{
    DATABASE_URL: string,
      JWT_SECRET: string,
  },
}>()


//c is context which has request and response object 
app.post('/api/v1/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())

  const body = await c.req.json();
	try {
		const user = await prisma.user.create({
			data: {
				email: body.email,
				password: body.password
			}
		});
	
		const token = await sign({id: user.id}, c.env.JWT_SECRET)
    return c.json({jwt:token})
	} catch(e) {
		return c.status(403);
	}
})
app.post('/api/v1/signin', (c) => {
  return c.text('Hello Hono!')
})
app.post('/api/v1/blog', (c) => {
  return c.text('Hello Hono!')
})
app.put('/api/v1/blog', (c) => {
  return c.text('Hello Hono!')
})
app.get('/api/v1/blog:id', (c) => {
  return c.text('Hello Hono!')
})

export default app
