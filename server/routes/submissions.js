import { Router } from "express";
import upload from "../middleware/upload.js";
import {
  getSubmissions,
  getSubmissionById,
  createSubmission,
  updateSubmissionStatus,
  deleteSubmission,
} from "../controllers/submissionController.js";

const router = Router();

router.get("/", getSubmissions);
router.get("/:id", getSubmissionById);
router.post("/", upload.any(), createSubmission);
router.patch("/:id/status", updateSubmissionStatus);
router.delete("/:id", deleteSubmission);

export default router;
