"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { handleAddNewSubject, handleGetSubjects, handleGetAllSubjects, handleGetSubjectById, handleUpdateSubject, } = require("../controllers/subject");
const router = (0, express_1.Router)();
router.post("/", handleAddNewSubject);
router.get("/", handleGetAllSubjects);
router.get("/byId/:id", handleGetSubjectById);
router.put("/:id", handleUpdateSubject);
router.get("/:departmentCode", handleGetSubjects);
module.exports = router;
//# sourceMappingURL=subject.route.js.map