"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const departments_model_1 = __importDefault(require("../models/departments.model"));
async function handleGetDepartments(req, res) {
    try {
        const departments = await departments_model_1.default.find().populate("subjects");
        return res.status(200).json(departments);
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to fetch departments",
        });
    }
}
async function handleAddDepartment(req, res) {
    try {
        const { name, departmentCode, description, yearsOfDegree, hod, image, banner, isActive, } = req.body;
        // Validation
        if (!name || !departmentCode) {
            res.status(400).json({
                success: false,
                message: "Name and departmentCode are required",
            });
            return;
        }
        // Check existing department
        const existingDepartment = await departments_model_1.default.findOne({
            $or: [
                { name: name.trim() },
                { departmentCode: departmentCode.trim().toUpperCase() },
            ],
        });
        if (existingDepartment) {
            res.status(409).json({
                success: false,
                message: existingDepartment.name === name
                    ? "Department name already exists"
                    : "Department code already exists",
            });
            return;
        }
        // Create department
        const department = await departments_model_1.default.create({
            name: name.trim(),
            departmentCode: departmentCode.trim().toUpperCase(),
            description,
            yearsOfDegree,
            hod,
            image,
            banner,
            isActive,
        });
        res.status(201).json({
            success: true,
            message: "Department created successfully",
            data: department,
        });
    }
    catch (error) {
        console.error("Add Department Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create department",
            error: error.message,
        });
    }
}
module.exports = {
    handleGetDepartments,
    handleAddDepartment,
};
//# sourceMappingURL=departments.js.map