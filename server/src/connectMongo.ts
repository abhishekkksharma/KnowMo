import mongoose from "mongoose";
import Departments from "./models/departments.model";
import Subject from "./models/subject.model";

export async function connectToMongoDB(url: string) {
  return mongoose.connect(url, {
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
