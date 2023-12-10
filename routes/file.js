import express from "express";
import multer from "multer";
import Controller from "../controllers/file.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/files", upload.single("file"), Controller.uploadModuleFile);
router.get("/files", Controller.getModuleFiles);
router.delete("/files/:id", Controller.deleteModuleFile);
router.get("/files/:id", Controller.getFile);

export default router;
