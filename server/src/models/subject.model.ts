import mongoose, { Schema, Document } from "mongoose";

export interface ISubject extends Document {
  name: string;
  departmentCode: string;
  year: number;
  semester?: number;
  totalSearches:number;
  subjectCode: string;
  resourceCount: number;
  resources?: mongoose.Types.ObjectId[];
}

const subjectSchema = new Schema<ISubject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    departmentCode: {
      type: String,
      required: true,
      index: true,
      uppercase: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      index: true,
    },
    semester: {
      type: Number,
      min: 1,
      max: 8,
    },
    totalSearches: {
      type: Number,
      default: 0,
    },
    subjectCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    resourceCount: {
      type: Number,
      default: 0,
    },
    resources: [
      {
        type: Schema.Types.ObjectId,
        ref: "Resource",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Subject = mongoose.model<ISubject>("Subject", subjectSchema);

export default Subject;