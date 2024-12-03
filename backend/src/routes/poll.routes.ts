import {Router} from "express";
import {createPoll, getPolls,pollDetail, votePoll} from "../controllers/Poll.controller" 
// import { authMiddleware } from "../middleware/authMiddleware";

const pollRouter = Router();

// router.post("/", authMiddleware, createPoll);
pollRouter.post('/', createPoll)
pollRouter.get("/", getPolls);
pollRouter.get('/:id', pollDetail)
pollRouter.post("/:id/vote", votePoll);

export default pollRouter;