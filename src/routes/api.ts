import { Router } from "express";
import * as authController from "../controllers/authController";
import { roleRoute } from "../middlewares/auth";

const router = Router();
router.get("/", roleRoute("admin"), authController.ping);
router.post("/login", authController.login);
router.post("/change-password", authController.changePassword);
router.post("/register", authController.register);

export default router;
 