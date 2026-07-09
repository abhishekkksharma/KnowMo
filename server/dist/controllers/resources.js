"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resource_model_1 = __importDefault(require("../models/resource.model"));
const subject_model_1 = __importDefault(require("../models/subject.model"));
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
        // Fetch all resources with this subjectCode
        const resources = await resource_model_1.default.find({ subjectCode: upperSubjectCode });
        return res.status(200).json({ resources });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch resources" });
    }
}
module.exports = {
    handleAddNewResource,
    handleGetResourcesBySubjectCode,
};
//# sourceMappingURL=resources.js.map