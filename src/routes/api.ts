import { Router } from "express";
import * as authController from "../controllers/authController";
import * as messageController from "../controllers/messageController";
import { roleRoute } from "../middlewares/auth";

const router = Router();
router.get("/", roleRoute("admin"), messageController.sendMessage);
router.delete("/", messageController.deleteMessage);
router.post("/login", authController.login);
router.post("/change-password", authController.changePassword);
router.post("/register", authController.register);

export default router;
 