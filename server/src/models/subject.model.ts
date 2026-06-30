import mongoose, { Schema, Document } from "mongoose";

export interface ISubject extends Document {
  name: string;
  departmentCode: string;
  year: number;
  semester?: number;
  subjectCode: string;
  resourceCount: number;
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
  },
  {
    timestamps: true,
  }
);

const Subject = mongoose.model<ISubject>("Subject", subjectSchema);

export default Subject;