"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const { handleAddNewResource, handleGetResourcesBySubjectCode, handleGetTestMcqs, handleAddMcqs, handleGenerateTest } = require("../controllers/resources");
// Configure multer for image uploads
const upload = (0, multer_1.default)({
    dest: path_1.default.join(__dirname, "../../uploads"),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    fileFilter: (_req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error("Only JPEG, PNG, and WebP images are allowed."));
        }
    },
});
const router = (0, express_1.Router)();
router.post("/", handleAddNewResource);
router.get("/:subjectCode", handleGetResourcesBySubjectCode);
router.get("/mcqs/:subjectCode", handleGetTestMcqs);
router.post("/mcqs", handleAddMcqs);
router.post("/test/mcqs/:subjectCode", upload.single("image"), handleGenerateTest);
module.exports = router;
//# sourceMappingURL=resource.route.js.map