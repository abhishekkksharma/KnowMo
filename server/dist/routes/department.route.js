"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { handleGetDepartments, handleAddDepartment, handleGetDepartmentById, handleUpdateDepartment, } = require("../controllers/departments");
const router = (0, express_1.Router)();
router.get("/", handleGetDepartments);
router.post("/", handleAddDepartment);
router.get("/:id", handleGetDepartmentById);
router.put("/:id", handleUpdateDepartment);
module.exports = router;
//# sourceMappingURL=department.route.js.map