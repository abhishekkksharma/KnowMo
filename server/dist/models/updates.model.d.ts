import mongoose, { Document } from "mongoose";
export interface IUpdate extends Document {
    title: string;
    description: string;
    date: Date;
}
declare const Update: mongoose.Model<IUpdate, {}, {}, {}, mongoose.Document<unknown, {}, IUpdate, {}, mongoose.DefaultSchemaOptions> & IUpdate & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUpdate>;
export default Update;
//# sourceMappingURL=updates.model.d.ts.map