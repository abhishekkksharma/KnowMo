import mongoose, { Document } from "mongoose";
export interface IContact extends Document {
    name: string;
    email: string;
    subject: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const Contact: mongoose.Model<IContact, {}, {}, {}, mongoose.Document<unknown, {}, IContact, {}, mongoose.DefaultSchemaOptions> & IContact & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IContact>;
export default Contact;
//# sourceMappingURL=contact.model.d.ts.map