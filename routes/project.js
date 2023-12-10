import express from "express";
import Controller from "../controllers/project.js";
import { authenticateToken } from "../middleware/authorization.js";

const router = express.Router();

router.post("/project-add", Controller.addProject);
router.get("/project", Controller.getProject);
router.get("/project/:id", Controller.getProjectById);

router.delete("/project/:id", Controller.deleteProject);
router.put("/project/:id", Controller.editProject);

export default router;
