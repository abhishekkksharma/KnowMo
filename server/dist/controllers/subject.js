"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subject_model_1 = __importDefault(require("../models/subject.model"));
const departments_model_1 = __importDefault(require("../models/departments.model"));
async function handleAddNewSubject(req, res) {
    try {
        const { name, departmentCode, year, semester, subjectCode, } = req.body;
        // Required field validation
        if (!name?.trim()) {
            return res.status(400).json({
                message: "Subject name is required",
            });
        }
        if (!departmentCode?.trim()) {
            return res.status(400).json({
                message: "Department code is required",
            });
        }
        if (!year) {
            return res.status(400).json({
                message: "Year is required",
            });
        }
        if (!subjectCode?.trim()) {
            return res.status(400).json({
                message: "Subject code is required",
            });
        }
        if (semester && (semester < 1 || semester > 8)) {
            return res.status(400).json({
                message: "Semester must be between 1 and 8",
            });
        }
        // Find the department with the matching departmentCode
        const department = await departments_model_1.default.findOne({
            departmentCode: departmentCode.trim().toUpperCase(),
        });
        if (!department) {
            return res.status(404).json({
                message: "Department not found",
            });
        }
        // Check duplicate subject code
        const existingSubject = await subject_model_1.default.findOne({
            subjectCode: subjectCode.toUpperCase(),
        });
        if (existingSubject) {
            return res.status(409).json({
                message: "Subject with this code already exists",
            });
        }
        const subject = await subject_model_1.default.create({
            name: name.trim(),
            departmentCode: departmentCode.toUpperCase(),
            year,
            semester,
            subjectCode: subjectCode.toUpperCase(),
        });
        // Add subject to department's subjects array and update totalSubjects count
        if (!department.subjects) {
            department.subjects = [];
        }
        department.subjects.push(subject._id);
        department.totalSubjects = department.subjects.length;
        await department.save();
        return res.status(201).json({
            message: "Subject created successfully",
            subject,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to create subject",
        });
    }
}
async function handleGetSubjects(req, res) {
    try {
        const { departmentCode } = req.params;
        await departments_model_1.default.updateOne({ departmentCode: departmentCode }, { $inc: { totalSearches: 1 } });
        const subjects = await subject_model_1.default.find({ departmentCode });
        return res.status(200).json({ subjects });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch subjects",
        });
    }
}
module.exports = {
    handleAddNewSubject,
    handleGetSubjects
};
//# sourceMappingURL=subject.js.map