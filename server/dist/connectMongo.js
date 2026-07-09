"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToMongoDB = connectToMongoDB;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectToMongoDB(url) {
    return mongoose_1.default.connect(url, {
        dbName: "KnowMo",
    });
}
// export async function syncExistingSubjects() {
//   try {
//     const departments = await Departments.find();
//     for (const dept of departments) {
//       // Find all subjects belonging to this department Code
//       const subjects = await Subject.find({ departmentCode: dept.departmentCode });
//       const subjectIds = subjects.map(s => s._id);
//       // Update department subjects and count
//       dept.subjects = subjectIds as mongoose.Types.ObjectId[];
//       dept.totalSubjects = subjectIds.length;
//       await dept.save();
//     }
//     console.log("Synchronized subjects for all departments.");
//   } catch (error) {
//     console.error("Error syncing subjects to departments:", error);
//   }
// }
//# sourceMappingURL=connectMongo.js.map