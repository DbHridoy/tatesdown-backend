import { Router } from "express";

const userRoute = Router();



// Test route
userRoute.get("/", (req, res) => {
  res.json({ message: "This is the user route" });
});



export default userRoute;
