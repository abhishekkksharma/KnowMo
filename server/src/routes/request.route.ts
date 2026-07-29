import { Router } from "express";

const { handleNewDepartmentRequest, handleNewSubjectRequest, handleGetAllRequests } = require("../controllers/request.controller");

const router = Router();

router.get("/", handleGetAllRequests);
router.post("/department", handleNewDepartmentRequest);
router.post("/subject", handleNewSubjectRequest);

module.exports = router;