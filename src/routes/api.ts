import { Router } from "express";
import * as authController from "../controllers/authController";
import * as messageController from "../controllers/messageController";
//import { roleRoute } from "../middlewares/auth";

const router = Router();
router.post("/",  messageController.sendMessage);
router.delete("/", messageController.deleteMessage);
router.put("/", messageController.editMessage);
router.post("/login", authController.login);
router.post("/change-password", authController.changePassword);
router.post("/register", authController.register);

export default router;
 