import { Router } from "express";
const {
  handleAddNewSubject,
  handleGetSubjects,
  handleGetAllSubjects,
  handleGetSubjectById,
  handleUpdateSubject,
} = require("../controllers/subject");

const router = Router();

router.post("/", handleAddNewSubject);
router.get("/", handleGetAllSubjects);
router.get("/byId/:id", handleGetSubjectById);
router.put("/:id", handleUpdateSubject);
router.get("/:departmentCode", handleGetSubjects);

module.exports = router;
