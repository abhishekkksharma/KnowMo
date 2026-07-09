"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { handleAddNewResource, handleGetResourcesBySubjectCode } = require("../controllers/resources");
const router = (0, express_1.Router)();
router.post("/", handleAddNewResource);
router.get("/:subjectCode", handleGetResourcesBySubjectCode);
module.exports = router;
//# sourceMappingURL=resource.route.js.map