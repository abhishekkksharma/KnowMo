"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { handleNewDepartmentRequest, handleNewSubjectRequest, handleGetAllRequests } = require("../controllers/request.controller");
const router = (0, express_1.Router)();
router.get("/", handleGetAllRequests);
router.post("/department", handleNewDepartmentRequest);
router.post("/subject", handleNewSubjectRequest);
module.exports = router;
//# sourceMappingURL=request.route.js.map