import {Router} from "express";
import { Request, Response, NextFunction } from 'express';
import { register, login } from "../controllers/Auth.controller";
import { authMiddleware } from "../middleware/authMiddleware";



const authRouter = Router();

const asyncMiddleware = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/protected", (asyncMiddleware(authMiddleware)), (req: Request, res: Response) => {
  res.status(200).json({
    message: "Protected content accessed!",
    user: (req as any).user.id
  });
});

export default authRouter;
