import mongoose, { Document } from "mongoose";
export interface IResource extends Document {
    title: string;
    type: "notes" | "pyq" | "assignment" | "lab" | "other";
    customType?: string;
    departmentCode: string;
    year: number;
    subjectCode: string;
    fileUrl?: string;
    description?: string;
    uploadedBy?: mongoose.Types.ObjectId;
}
declare const _default: mongoose.Model<IResource, {}, {}, {}, mongoose.Document<unknown, {}, IResource, {}, mongoose.DefaultSchemaOptions> & IResource & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IResource>;
export default _default;
//# sourceMappingURL=resource.model.d.ts.map