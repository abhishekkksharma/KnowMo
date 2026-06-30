import mongoose, { Document } from "mongoose";
export interface IDepartment extends Document {
    name: string;
    departmentCode: string;
    description?: string;
    yearsOfDegree: number;
    totalSearches?: number;
    totalResources?: number;
    totalSubjects?: number;
    subjects?: mongoose.Types.ObjectId[];
    hod?: string;
    image?: string;
    banner?: string;
    isActive?: boolean;
}
declare const Departments: mongoose.Model<IDepartment, {}, {}, {}, mongoose.Document<unknown, {}, IDepartment, {}, mongoose.DefaultSchemaOptions> & IDepartment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IDepartment>;
export default Departments;
//# sourceMappingURL=departments.model.d.ts.map