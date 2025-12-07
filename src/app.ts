import express from "express";
import type { Application, Request, Response } from "express";
import { errorHandler } from "./middlewares/error-handler.middleware";
import appRouter from "./routes/index";

const app: Application = express();

// Middleware
app.use(express.json());


// Versioned router
app.use("/api/v1",appRouter)

// Test route
app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Server is running" });
});

// Versioned route tester
app.get("/api/v1", (req: Request, res: Response) => {
    res.json({ message: "Server is running with version 1" });
});

// Global error handler
app.use(errorHandler)


export default app;
