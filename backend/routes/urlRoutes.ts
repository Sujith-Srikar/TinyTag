import express from "express";
import {
  urlAnalytic,
  urlDelete,
  urlEditLongUrl,
  urlRedirection,
  urlShorten,
} from "../controllers/urlController";

const router = express.Router();

router.post("/shorten", urlShorten);
router.get("/:shortCode", urlRedirection);
router.get("/analytics/:shortCode", urlAnalytic);
router.put("/edit/:shortCode", urlEditLongUrl);
router.delete("/:shortCode", urlDelete);

export default router;
