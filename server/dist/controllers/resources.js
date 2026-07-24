"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resource_model_1 = __importDefault(require("../models/resource.model"));
const subject_model_1 = __importDefault(require("../models/subject.model"));
const departments_model_1 = __importDefault(require("../models/departments.model"));
const promises_1 = __importDefault(require("fs/promises"));
const generateMcqs_1 = require("../services/generateMcqs/generateMcqs");
const { createUpdate } = require("./updates");
async function handleAddNewResource(req, res) {
    try {
        const { title, type, customType, departmentCode, year, subjectCode, fileUrl, description, uploadedBy, } = req.body;
        // Required fields validation
        if (!title?.trim()) {
            return res.status(400).json({ message: "Title is required" });
        }
        if (!type) {
            return res.status(400).json({ message: "Type is required" });
        }
        if (!departmentCode?.trim()) {
            return res.status(400).json({ message: "Department code is required" });
        }
        if (year === undefined || year === null) {
            return res.status(400).json({ message: "Year is required" });
        }
        if (!subjectCode?.trim()) {
            return res.status(400).json({ message: "Subject code is required" });
        }
        if (!fileUrl?.trim()) {
            return res.status(400).json({ message: "File URL is required" });
        }
        // Check if the subject exists by subjectCode
        const subject = await subject_model_1.default.findOne({
            subjectCode: subjectCode.trim().toUpperCase(),
        });
        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }
        // Create update BEFORE saving resource
        await createUpdate(`Resource added for ${subject.name || subject.subjectCode}`, `${type}${customType ? ` (${customType})` : ""} added for ${subject.name || subject.subjectCode}`);
        // Create the resource
        const newResource = await resource_model_1.default.create({
            title: title.trim(),
            type,
            customType: customType?.trim() || null,
            departmentCode: departmentCode.trim().toUpperCase(),
            year,
            subjectCode: subjectCode.trim().toUpperCase(),
            fileUrl: fileUrl.trim(),
            description: description?.trim(),
            uploadedBy: uploadedBy || null,
        });
        // Add resource ID to subject's resources array and update resourceCount
        if (!subject.resources) {
            subject.resources = [];
        }
        subject.resources.push(newResource._id);
        subject.resourceCount = subject.resources.length;
        await subject.save();
        return res.status(201).json({
            message: "Resource added successfully",
            resource: newResource,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to add resource" });
    }
}
async function handleGetResourcesBySubjectCode(req, res) {
    try {
        const { subjectCode } = req.params;
        if (!subjectCode?.trim()) {
            return res.status(400).json({ message: "Subject code is required" });
        }
        const upperSubjectCode = subjectCode.trim().toUpperCase();
        // Fetch the subject to verify it exists
        const subject = await subject_model_1.default.findOne({ subjectCode: upperSubjectCode });
        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }
        // Fetch the department to get the department name
        const department = await departments_model_1.default.findOne({ departmentCode: subject.departmentCode });
        // Fetch all resources with this subjectCode
        const resources = await resource_model_1.default.find({ subjectCode: upperSubjectCode });
        return res.status(200).json({
            resources,
            subject,
            departmentName: department ? department.name : subject.departmentCode
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch resources" });
    }
}
async function handleGetTestMcqs(req, res) {
    try {
        const { subjectCode } = req.params;
        const count = Number(req.query.count);
        const subject = await subject_model_1.default.findOne({
            subjectCode: subjectCode.toUpperCase(),
        }).select("questionBank");
        if (!subject || !subject.questionBank) {
            return res.status(404).json({
                success: false,
                message: "MCQs not found.",
            });
        }
        let questions = [...subject.questionBank];
        // Shuffle and return only `count` questions if requested
        if (!isNaN(count) && count > 0) {
            questions = questions.sort(() => Math.random() - 0.5).slice(0, count);
        }
        const testQuestions = questions.map((q) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
        }));
        return res.status(200).json({
            success: true,
            total: testQuestions.length,
            data: testQuestions,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}
async function handleAddMcqs(req, res) {
    try {
        const { subjectCode, questions } = req.body;
        if (!subjectCode) {
            return res.status(400).json({
                success: false,
                message: "Subject code is required.",
            });
        }
        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Questions must be a non-empty array.",
            });
        }
        const subject = await subject_model_1.default.findOneAndUpdate({
            subjectCode: subjectCode.toUpperCase(),
        }, {
            $push: {
                questionBank: {
                    $each: questions,
                },
            },
        }, {
            new: true,
        });
        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: `${questions.length} question(s) added successfully.`,
            totalQuestions: subject.questionBank?.length || 0,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}
async function handleGenerateTest(req, res) {
    try {
        const { subjectCode } = req.params;
        const { prompt, numberOfQuestions } = req.body;
        const image = req.file;
        if (!subjectCode?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Subject code is required.",
            });
        }
        const totalQuestions = Number(numberOfQuestions) || 20;
        const mcqs = await (0, generateMcqs_1.generateMcqs)({
            subjectCode: subjectCode,
            numberOfQuestions: totalQuestions,
            prompt,
            imagePath: image?.path,
        });
        // Delete uploaded image after processing
        if (image) {
            await promises_1.default.unlink(image.path).catch(() => { });
        }
        return res.status(200).json({
            success: true,
            total: mcqs.length,
            data: mcqs,
        });
    }
    catch (error) {
        console.error("Generate Test Error:", error);
        // Clean up uploaded file if an error occurs
        if (req.file) {
            await promises_1.default.unlink(req.file.path).catch(() => { });
        }
        return res.status(500).json({
            success: false,
            message: "Failed to generate MCQs.",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
module.exports = {
    handleAddNewResource,
    handleGetResourcesBySubjectCode,
    handleGetTestMcqs,
    handleAddMcqs,
    handleGenerateTest,
};
//# sourceMappingURL=resources.js.map