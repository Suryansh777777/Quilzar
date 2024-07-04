import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {decode,sign,verify } from 'hono/jwt'
export const blogRouter = new Hono<{
    Bindings:{
      DATABASE_URL: string,
        JWT_SECRET: string,
    },
    Variables:{
        userId: string
        }
        
  }>()

  ///api/v1/blog/*
  //middleware extract the userid pass it down to the route handler
  blogRouter.use('/*', async (c, next) => {
    //get the header verify the header if header is correct proceed if not we notify the user
    const authHeader = c.req.header('authorization') || ''  ; 
    const token = authHeader.split(' ')[1]
    const response = await verify(authHeader, c.env.JWT_SECRET)
    if (response) {
        c.set("userId", response.id as string)
       await next()
    }else{
       c.status(403)
       return c.json({error: 'unauthorized'})
    }
  })
  
  
  // /api/v1/blog:id
  blogRouter.post('/', async(c) => { 
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  
    const body = await c.req.json();
    const authorId = c.get('userId')
      try {
          const post = await prisma.post.create({
              data: {
                  title: body.title,
                  content: body.content,
                  authorId: authorId
              }
          });
      
         
      return c.json({id:post.id})
      } catch(e) {
          return c.status(403);
      }
  })
  blogRouter.put('/', async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
      const body = await c.req.json();
        try {
            const post = await prisma.post.update({
                where:{
                    id: body.id
                },
                data: {
                    title: body.title,
                    content: body.content,
                }
            });
        
           
        return c.json({id:post.id})
        } catch(e) {
            return c.status(403);
        }
  })
  //'/:id' might be a bug
  blogRouter.get('/:id', async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
      const body = await c.req.json();
        try {
            const post = await prisma.post.findFirst({
                where:{
                    id: body.id
                },
               
            });
        
           
        return c.json(post)
        } catch(e) {
            return c.status(403);
        }
  })

  //you should do pagination on this 
  blogRouter.get('/bulk', async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const post = await prisma.post.findMany();
  })