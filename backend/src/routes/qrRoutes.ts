import express from "express";
import { upload } from "../middlewares/qrValidation";
import generateQR from "../controllers/qrController";

const router = express.Router();

router.post("/generate", upload.single("logo"), generateQR);

export default router;