import mongoose, { Document } from "mongoose";
export interface IMCQ {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
}
export interface ISubject extends Document {
    name: string;
    departmentCode: string;
    year: number;
    semester?: number;
    totalSearches: number;
    subjectCode: string;
    resourceCount: number;
    resources?: mongoose.Types.ObjectId[];
    questionBank?: IMCQ[];
}
declare const Subject: mongoose.Model<ISubject, {}, {}, {}, mongoose.Document<unknown, {}, ISubject, {}, mongoose.DefaultSchemaOptions> & ISubject & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ISubject>;
export default Subject;
//# sourceMappingURL=subject.model.d.ts.map