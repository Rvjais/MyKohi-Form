import { Router } from "express";
import {
  getTemplates,
  getTemplateBySlug,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from "../controllers/templateController.js";

const router = Router();

router.get("/", getTemplates);
router.get("/slug/:slug", getTemplateBySlug);
router.get("/:id", getTemplateById);
router.post("/", createTemplate);
router.put("/:id", updateTemplate);
router.delete("/:id", deleteTemplate);

export default router;
