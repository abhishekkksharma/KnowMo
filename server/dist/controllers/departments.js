"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const departments_model_1 = __importDefault(require("../models/departments.model"));
const mongoose_1 = __importDefault(require("mongoose"));
async function handleGetDepartments(req, res) {
    try {
        const departments = await departments_model_1.default.find();
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
async function handleGetDepartmentById(req, res) {
    try {
        const id = req.params.id;
        let department;
        if (mongoose_1.default.Types.ObjectId.isValid(id)) {
            department = await departments_model_1.default.findById(id).populate({
                path: "subjects",
                select: "-questionBank",
            });
        }
        else {
            department = await departments_model_1.default.findOne({
                departmentCode: id.trim().toUpperCase(),
            }).populate({
                path: "subjects",
                select: "-questionBank",
            });
        }
        if (!department) {
            return res.status(404).json({ success: false, message: "Department not found" });
        }
        return res.status(200).json({ success: true, data: department });
    }
    catch (error) {
        console.error("Get Department By ID Error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch department", error: error.message });
    }
}
async function handleUpdateDepartment(req, res) {
    try {
        const id = req.params.id;
        const { name, departmentCode, description, yearsOfDegree, hod, image, banner, isActive, } = req.body;
        const query = mongoose_1.default.Types.ObjectId.isValid(id)
            ? { _id: id }
            : { departmentCode: id.trim().toUpperCase() };
        // Check duplicate if updating code or name
        if (departmentCode || name) {
            const existing = await departments_model_1.default.findOne({
                $or: [
                    ...(name ? [{ name: name.trim() }] : []),
                    ...(departmentCode ? [{ departmentCode: departmentCode.trim().toUpperCase() }] : []),
                ],
                _id: { $ne: query._id || undefined },
            });
            if (existing && existing._id.toString() !== id) {
                return res.status(409).json({
                    success: false,
                    message: existing.name === name
                        ? "Department name already in use by another department"
                        : "Department code already in use by another department",
                });
            }
        }
        const updated = await departments_model_1.default.findOneAndUpdate(query, {
            $set: {
                ...(name && { name: name.trim() }),
                ...(departmentCode && { departmentCode: departmentCode.trim().toUpperCase() }),
                ...(description !== undefined && { description: description.trim() }),
                ...(yearsOfDegree !== undefined && { yearsOfDegree: Number(yearsOfDegree) }),
                ...(hod !== undefined && { hod: hod.trim() }),
                ...(image !== undefined && { image }),
                ...(banner !== undefined && { banner }),
                ...(isActive !== undefined && { isActive: Boolean(isActive) }),
            },
        }, { new: true });
        if (!updated) {
            return res.status(404).json({ success: false, message: "Department not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Department updated successfully",
            data: updated,
        });
    }
    catch (error) {
        console.error("Update Department Error:", error);
        return res.status(500).json({ success: false, message: "Failed to update department", error: error.message });
    }
}
module.exports = {
    handleGetDepartments,
    handleAddDepartment,
    handleGetDepartmentById,
    handleUpdateDepartment,
};
//# sourceMappingURL=departments.js.map