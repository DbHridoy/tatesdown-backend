import { Router } from "express";
import userRoute from "../modules/user/user.route";
import authRoute from "../modules/auth/auth.route";
import adminRoute from "../modules/admin/admin.route";
import clientRoute from "../modules/client/client.route";
import quoteRoute from "../modules/quote/quote.route";
import jobRoute from "../modules/job/job.route";
import expenseRoute from "../modules/expense/expense.route";
import designConsultationRoute from "../modules/design-consultation/design-consultation.route";

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
    path: "/job",
    router: jobRoute,
  },
  {
    path: "/design-consultation",
    router: designConsultationRoute,
  },
  {
    path: "/expense",
    router: expenseRoute,
  },
  {
    path: "/user",
    router: userRoute,
  },
];

moduleRoutes.forEach((route) => appRouter.use(route.path, route.router));

export default appRouter;
