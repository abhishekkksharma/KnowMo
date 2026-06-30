"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToMongoDB = connectToMongoDB;
exports.syncExistingSubjects = syncExistingSubjects;
const mongoose_1 = __importDefault(require("mongoose"));
const departments_model_1 = __importDefault(require("./models/departments.model"));
const subject_model_1 = __importDefault(require("./models/subject.model"));
async function connectToMongoDB(url) {
    return mongoose_1.default.connect(url, {
        dbName: "KnowMo",
    });
}
async function syncExistingSubjects() {
    try {
        const departments = await departments_model_1.default.find();
        for (const dept of departments) {
            // Find all subjects belonging to this department Code
            const subjects = await subject_model_1.default.find({ departmentCode: dept.departmentCode });
            const subjectIds = subjects.map(s => s._id);
            // Update department subjects and count
            dept.subjects = subjectIds;
            dept.totalSubjects = subjectIds.length;
            await dept.save();
        }
        console.log("Synchronized subjects for all departments.");
    }
    catch (error) {
        console.error("Error syncing subjects to departments:", error);
    }
}
//# sourceMappingURL=connectMongo.js.map