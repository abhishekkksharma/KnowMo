import { Router } from "express";
const { handleAddNewSubject, handleGetSubjects, handleGetAllSubjects } = require("../controllers/subject");

const router = Router();

router.post("/", handleAddNewSubject);
router.get("/", handleGetAllSubjects);
router.get("/:departmentCode", handleGetSubjects);

module.exports = router;
