import express from "express";
import { register, login, requestReset, resetPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/request-reset", requestReset);
router.post("/reset", resetPassword);

export default router;
