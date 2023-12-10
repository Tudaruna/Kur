import express from "express";
import Controller from "../controllers/auth.js";

const router = express.Router();

router.post("/login", Controller.login);
router.post("/register", Controller.register);
router.put("/update/:id",Controller.update);
router.delete("/delete/:id", Controller.deleteAccount);

export default router;
