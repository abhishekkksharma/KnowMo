"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { handleAddNewSubject, handleGetSubjects, handleGetAllSubjects } = require("../controllers/subject");
const router = (0, express_1.Router)();
router.post("/", handleAddNewSubject);
router.get("/", handleGetAllSubjects);
router.get("/:departmentCode", handleGetSubjects);
module.exports = router;
//# sourceMappingURL=subject.route.js.map