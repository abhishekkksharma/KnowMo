import { Router } from "express";
const { handleAddNewResource, handleGetResourcesBySubjectCode, handleGetTestMcqs, handleAddMcqs,handleGenerateTest } = require("../controllers/resources");

const router = Router();

router.post("/", handleAddNewResource);
router.get("/:subjectCode", handleGetResourcesBySubjectCode);
router.get("/mcqs/:subjectCode", handleGetTestMcqs);
router.post("/mcqs", handleAddMcqs);
router.get("/test/mcqs",handleGenerateTest);

module.exports = router;
