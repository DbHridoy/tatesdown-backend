import {z} from 'zod'

export const createUserSchema=z.object({
    fullName:z.string(),
    email:z.email(),
    role:z.enum(['production-manager','sales-rep']),
    password:z.string()
})


