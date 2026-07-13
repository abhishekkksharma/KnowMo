import mongoose, { Schema, Document } from "mongoose";

export interface IUpdate extends Document {
  title: string;
  description: string;
  date: Date;
}

const UpdateSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, 
  },
});

const Update = mongoose.model<IUpdate>("Update", UpdateSchema);

export default Update;