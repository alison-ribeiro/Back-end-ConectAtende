import { Router } from "express";
import * as authController from "../controllers/authController";

const router = Router();
router.get("/", authController.ping);
router.post("/login", authController.login);
// router.post("/change-password", authController.changePassword);
router.post("/register", authController.register);

export default router;
 