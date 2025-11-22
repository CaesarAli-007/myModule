import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import surveyRoutes from "./routes/survey.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/survey", surveyRoutes);

app.get("/", (req, res) => res.send("Backend running OK"));

const PORT = 3000;
app.listen(PORT, () => console.log(`⚡ Backend running on http://localhost:${PORT}`));
