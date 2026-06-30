"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { handleGetDepartments, handleAddDepartment } = require("../controllers/departments");
const router = (0, express_1.Router)();
router.get("/", handleGetDepartments);
router.post("/", handleAddDepartment);
module.exports = router;
//# sourceMappingURL=department.route.js.map