import { Router } from "express";
import userRoute from "../modules/user/user.route";
import authRoute from "../modules/auth/auth.route";
import adminRoute from "../modules/admin/admin.route";
import clientRoute from "../modules/client/client.route";
import quoteRoute from "../modules/quote/quote.route";

const appRouter = Router();

const moduleRoutes = [
  {
    path: "/auth",
    router: authRoute,
  },
  {
    path: "/admin",
    router: adminRoute,
  },
  {
    path: "/client",
    router: clientRoute,
  },
  {
    path: "/quote",
    router: quoteRoute,
  },
  {
    path: "/user",
    router: userRoute,
  },
];

moduleRoutes.forEach((route) => appRouter.use(route.path, route.router));

export default appRouter;
