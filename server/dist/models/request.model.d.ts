import mongoose, { Document } from "mongoose";
export interface IRequest extends Document {
    type: "Department" | "Subject";
    email: string;
    departmentName?: string;
    degreeYears?: number;
    departmentCode?: string;
    subjectName?: string;
    year?: number;
    status: "Pending" | "Approved" | "Rejected";
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IRequest, {}, {}, {}, mongoose.Document<unknown, {}, IRequest, {}, mongoose.DefaultSchemaOptions> & IRequest & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IRequest>;
export default _default;
//# sourceMappingURL=request.model.d.ts.map