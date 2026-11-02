import { Router } from "express";

const {
  handleGetDepartments,
  handleAddDepartment,
  handleGetDepartmentById,
  handleUpdateDepartment,
} = require("../controllers/departments");

const router = Router();

router.get("/", handleGetDepartments);
router.post("/", handleAddDepartment);
router.get("/:id", handleGetDepartmentById);
router.put("/:id", handleUpdateDepartment);

module.exports = router;
