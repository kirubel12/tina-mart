import express from "express"
import { getCategories, createCategory, updateCategory, deleteCategory, getCategoryById,  } from "../controllers/category.controller.js";
import { authMiddleware, checkRole } from "../middleware/auth.js";



const categoryRouter = express.Router();


categoryRouter.get("/", authMiddleware, checkRole("admin"), getCategories);
categoryRouter.post("/", authMiddleware, checkRole("admin"), createCategory);
categoryRouter.put("/:id", authMiddleware, checkRole("admin"), updateCategory);
categoryRouter.delete("/:id", authMiddleware, checkRole("admin"), deleteCategory);
categoryRouter.get("/:id", authMiddleware, checkRole("admin"), getCategoryById);

export default categoryRouter;