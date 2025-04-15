import { Router } from "express";
import * as UserController from "../controllers/user.controllers";

const router = Router();

router.post("/add", UserController.createUser);

export default router;
