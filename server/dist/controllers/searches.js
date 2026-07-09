"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subject_model_1 = __importDefault(require("../models/subject.model"));
const departments_model_1 = __importDefault(require("../models/departments.model"));
async function handleSearch(req, res) {
    try {
        const { q } = req.query;
        if (!q || typeof q !== "string") {
            return res.status(400).json({
                success: false,
                message: "Search query is required",
            });
        }
        const searchRegex = new RegExp(q.trim(), "i");
        const isDeptCode = await departments_model_1.default.exists({
            departmentCode: q.trim().toUpperCase(),
        });
        const subjectQuery = isDeptCode
            ? { name: searchRegex }
            : {
                $or: [
                    { name: searchRegex },
                    { subjectCode: searchRegex },
                ],
            };
        const [departments, subjects] = await Promise.all([
            departments_model_1.default.find({
                $or: [
                    { name: searchRegex },
                    { departmentCode: searchRegex },
                ],
            })
                .select("name departmentCode")
                .lean(),
            subject_model_1.default.find(subjectQuery)
                .select("name subjectCode departmentCode year semester")
                .lean(),
        ]);
        return res.status(200).json({
            success: true,
            query: q,
            results: {
                departments,
                subjects,
            },
            totalResults: departments.length + subjects.length,
        });
    }
    catch (error) {
        console.error("Search Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}
;
module.exports = {
    handleSearch,
};
//# sourceMappingURL=searches.js.map