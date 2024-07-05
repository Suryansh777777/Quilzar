import z from "zod";

export const signupInput = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().optional()
});
    //type inference in zod will be used in frontends untill we introduce monorepo
export const signinInput = z.object({
    email: z.string().email(),
    password: z.string().min(8)
});

export const createBlogInput = z.object({   
    title: z.string(),
    content: z.string()
});

export const updateBlogInput = z.object({
    id: z.number(),
    title: z.string(),
    content: z.string()
});
export type CreateBlogInput = z.infer<typeof createBlogInput>
export type SigninInput = z.infer<typeof signinInput>
export type SignupInput = z.infer<typeof signupInput> 
export type UpdateBlogInput = z.infer<typeof updateBlogInput>