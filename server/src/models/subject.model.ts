import mongoose, { Schema, Document } from "mongoose";

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

const mcqSchema = new Schema<IMCQ>(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length >= 2,
        message: "At least 2 options are required",
      },
    },

    correctAnswer: {
      type: String,
      required: true,
    },

    explanation: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

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
    questionBank: {
      type: [mcqSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Subject = mongoose.model<ISubject>("Subject", subjectSchema);

export default Subject;