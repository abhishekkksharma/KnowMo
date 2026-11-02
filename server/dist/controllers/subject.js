"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subject_model_1 = __importDefault(require("../models/subject.model"));
const departments_model_1 = __importDefault(require("../models/departments.model"));
const mongoose_1 = __importDefault(require("mongoose"));
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
async function handleGetAllSubjects(req, res) {
    try {
        // Exclude questionBank to avoid sending heavy data and save bandwidth
        const subjects = await subject_model_1.default.find().select("-questionBank").sort({ createdAt: -1 });
        return res.status(200).json({ subjects });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch subjects",
        });
    }
}
async function handleGetSubjects(req, res) {
    try {
        const { departmentCode } = req.params;
        await departments_model_1.default.updateOne({ departmentCode: departmentCode }, { $inc: { totalSearches: 1 } });
        // Exclude questionBank to save bandwidth
        const subjects = await subject_model_1.default.find({ departmentCode }).select("-questionBank");
        return res.status(200).json({ subjects });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch subjects",
        });
    }
}
async function handleGetSubjectById(req, res) {
    try {
        const id = req.params.id;
        let subject;
        if (mongoose_1.default.Types.ObjectId.isValid(id)) {
            subject = await subject_model_1.default.findById(id).select("-questionBank").populate("resources");
        }
        else {
            subject = await subject_model_1.default.findOne({
                subjectCode: id.trim().toUpperCase(),
            }).select("-questionBank").populate("resources");
        }
        if (!subject) {
            return res.status(404).json({ success: false, message: "Subject not found" });
        }
        // Get question bank count without returning the questions themselves
        const rawSubject = await subject_model_1.default.findById(subject._id).select("questionBank");
        const questionBankCount = rawSubject?.questionBank?.length || 0;
        return res.status(200).json({
            success: true,
            data: subject,
            questionBankCount,
        });
    }
    catch (error) {
        console.error("Get Subject By ID Error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch subject", error: error.message });
    }
}
async function handleUpdateSubject(req, res) {
    try {
        const id = req.params.id;
        const { name, departmentCode, year, semester, subjectCode } = req.body;
        const query = mongoose_1.default.Types.ObjectId.isValid(id)
            ? { _id: id }
            : { subjectCode: id.trim().toUpperCase() };
        // Check if new subjectCode already exists on another subject
        if (subjectCode) {
            const existing = await subject_model_1.default.findOne({
                subjectCode: subjectCode.trim().toUpperCase(),
                _id: { $ne: query._id || undefined },
            });
            if (existing && existing._id.toString() !== id) {
                return res.status(409).json({
                    success: false,
                    message: "Another subject with this subject code already exists",
                });
            }
        }
        const updated = await subject_model_1.default.findOneAndUpdate(query, {
            $set: {
                ...(name && { name: name.trim() }),
                ...(departmentCode && { departmentCode: departmentCode.trim().toUpperCase() }),
                ...(year !== undefined && { year: Number(year) }),
                ...(semester !== undefined && { semester: Number(semester) }),
                ...(subjectCode && { subjectCode: subjectCode.trim().toUpperCase() }),
            },
        }, { new: true }).select("-questionBank");
        if (!updated) {
            return res.status(404).json({ success: false, message: "Subject not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Subject updated successfully",
            data: updated,
        });
    }
    catch (error) {
        console.error("Update Subject Error:", error);
        return res.status(500).json({ success: false, message: "Failed to update subject", error: error.message });
    }
}
module.exports = {
    handleAddNewSubject,
    handleGetSubjects,
    handleGetAllSubjects,
    handleGetSubjectById,
    handleUpdateSubject,
};
//# sourceMappingURL=subject.js.map