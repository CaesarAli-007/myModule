import express from "express";
import { submitSurvey } from "../controllers/surveyController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/submit", auth, submitSurvey);

export default router;
