import { Router } from "express";
import multer from "multer";
import path from "path";

const { handleAddNewResource, handleGetResourcesBySubjectCode, handleGetTestMcqs, handleAddMcqs,handleGenerateTest } = require("../controllers/resources");

// Configure multer for image uploads
const upload = multer({
  dest: path.join(__dirname, "../../uploads"),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and WebP images are allowed."));
    }
  },
});

const router = Router();

router.post("/", handleAddNewResource);
router.get("/:subjectCode", handleGetResourcesBySubjectCode);
router.get("/mcqs/:subjectCode", handleGetTestMcqs);
router.post("/mcqs", handleAddMcqs);
router.post("/test/mcqs/:subjectCode", upload.single("image"), handleGenerateTest);

module.exports = router;
