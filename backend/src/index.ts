import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {decode,sign,verify } from 'hono/jwt'
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'
// whenever you want to use env variables you need to define them in the type of the app
const app = new Hono<{
  Bindings:{
    DATABASE_URL: string,
      JWT_SECRET: string,
  },
}>()

app.route('/api/v1/signup', userRouter)
app.route('/api/v1/blog', blogRouter)



export default app
