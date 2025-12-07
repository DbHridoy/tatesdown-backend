import { Router } from "express";
import userRoute from "../modules/user/user.route";

const appRouter= Router()

const moduleRoutes=[
    {
        path:"/user",
        router:userRoute
    }
]

moduleRoutes.forEach((route)=>appRouter.use(route.path,route.router))

export default appRouter