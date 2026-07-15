import mongoose, { Schema, Document } from "mongoose";

interface IMCQ {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface IResource extends Document {
  title: string;

  type:
    | "notes"
    | "pyq"
    | "assignment"
    | "lab"
    | "mcqs"
    | "other";

  customType?: string;
  departmentCode: string;
  year: number;
  subjectCode: string;

  fileUrl?: string;

  questionBank?: IMCQ[];

  description?: string;
  uploadedBy?: mongoose.Types.ObjectId;
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

const resourceSchema = new Schema<IResource>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["notes", "pyq", "assignment", "lab", "mcqs", "other"],
      required: true,
    },

    customType: {
      type: String,
      trim: true,
      default: null,
    },

    departmentCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    year: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },

    subjectCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    fileUrl: {
      type: String,
      trim: true,
    },

    questionBank: {
      type: [mcqSchema],
      default: [],
    },

    description: {
      type: String,
      trim: true,
    },

    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IResource>("Resource", resourceSchema);