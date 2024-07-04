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

app.use('/api/v1/blog/*', async (c, next) => {
  //get the header verify the header if header is correct proceed if not we notify the user
  const header = c.req.header('authorization') || ''  ; 
  const token = header.split(' ')[1]
  const response = await verify(token, c.env.JWT_SECRET)
  if (response.id) {
     next()
  }else{
     c.status(403)
     return c.json({error: 'unauthorized'})
  }
  await next()
})
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

app.post('/api/v1/signin', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const user = await prisma.user.findUnique({
		where: {
			email: body.email,
      password: body.password
		}
	});

	if (!user) {
		c.status(403);
		return c.json({ error: "user not found" });
	}

	const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
	return c.json({ jwt });
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
