import { HashUtils } from "./utils/hash-utils";
import { JwtUtils } from "./utils/jwt-utils";
import { Mailer } from "./utils/mailer-utils";
import { CommonRepository } from "./modules/common/common.repository";
import { CommonService } from "./modules/common/common.service";
import { CommonController } from "./modules/common/common.controller";
import { UserRepository } from "./modules/user/user.repository";
import { UserService } from "./modules/user/user.service";
import { UserController } from "./modules/user/user.controller";
import { AuthMiddleware } from "./middlewares/auth.middleware";
import { ClientRepository } from "./modules/client/client.repository";
import { ClientService } from "./modules/client/client.service";
import { ClientController } from "./modules/client/client.controller";
import { AuthRepository } from "./modules/auth/auth.repository";
import { AuthService } from "./modules/auth/auth.service";
import { AuthController } from "./modules/auth/auth.controller";
import { ExpenseRepository } from "./modules/expense/expense.repository";
import { ExpenseService } from "./modules/expense/expense.service";
import { ExpenseController } from "./modules/expense/expense.controller";
import { JobRepository } from "./modules/job/job.repository";
import { JobService } from "./modules/job/job.service";
import { JobController } from "./modules/job/job.controller";
import { QuoteRepository } from "./modules/quote/quote.repository";
import { QuoteService } from "./modules/quote/quote.service";
import { QuoteController } from "./modules/quote/quote.controller";
import { buildDynamicSearch } from "./utils/dynamic-search-utils";
import { StatsRepository } from "./modules/stats/stats.repository";
import { StatsService } from "./modules/stats/stats.service";
import { StatsController } from "./modules/stats/stats.controller";

export const hashUtils = new HashUtils();
export const jwtUtils = new JwtUtils();
export const mailer = new Mailer();

export const commonRepository = new CommonRepository();
export const commonService = new CommonService(commonRepository);
export const commonController = new CommonController(commonService);

export const userRepository = new UserRepository(buildDynamicSearch);
export const userService = new UserService(userRepository, hashUtils, mailer);
export const userController = new UserController(userService);

export const clientRepository = new ClientRepository();
export const clientService = new ClientService(clientRepository);
export const clientController = new ClientController(clientService);

export const authRepo = new AuthRepository();
export const authService = new AuthService(
  authRepo,
  userRepository,
  hashUtils,
  jwtUtils,
  mailer
);
export const authMiddleware = new AuthMiddleware(jwtUtils, userRepository);
export const authController = new AuthController(authService);

export const expenseRepository = new ExpenseRepository();
export const expenseService = new ExpenseService(
  expenseRepository,
  commonService
);
export const expenseController = new ExpenseController(expenseService);

export const jobRepository = new JobRepository();
export const jobService = new JobService(jobRepository);
export const jobController = new JobController(jobService);

export const quoteRepository = new QuoteRepository();
export const quoteService = new QuoteService(quoteRepository);
export const quoteController = new QuoteController(quoteService);

export const statsRepository = new StatsRepository();
export const statsService = new StatsService(statsRepository);
export const statsController = new StatsController(statsService);
