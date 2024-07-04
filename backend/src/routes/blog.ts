import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {decode,sign,verify } from 'hono/jwt'
export const blogRouter = new Hono<{
    Bindings:{
      DATABASE_URL: string,
        JWT_SECRET: string,
    },
  }>()
//
  blogRouter.use('/*', async (c, next) => {
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
  
  

  blogRouter.post('/', (c) => {
    return c.text('Hello Hono!')
  })
  blogRouter.put('/', (c) => {
    return c.text('Hello Hono!')
  })
  blogRouter.get('/:id', (c) => {
    return c.text('Hello Hono!')
  })
  blogRouter.get('/bulk', (c) => {
    return c.text('Hello Hono!')
  })