import { Router } from "express";
const { handleAddNewResource, handleGetResourcesBySubjectCode } = require("../controllers/resources");

const router = Router();

router.post("/", handleAddNewResource);
router.get("/:subjectCode", handleGetResourcesBySubjectCode);

module.exports = router;
