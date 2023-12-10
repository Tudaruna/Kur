import express from "express";
import module from "../controllers/module.js";
const router = express.Router();

router.post("/module-add", module.addModule);
router.get("/modules", module.getModules);
router.delete("/module/:id", module.deleteModule);
router.get("/modules/:id", module.getModules);

export default router;
