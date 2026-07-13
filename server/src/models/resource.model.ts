import mongoose, { Schema, Document } from "mongoose";

export interface IResource extends Document {
  title: string;

  type:
    | "notes"
    | "pyq"
    | "test"
    | "mcqs"
    | "other";

  customType?: string;

  departmentCode: string;

  year: number;

  subjectCode: string;

  fileUrl: string;

  description?: string;

  uploadedBy?: mongoose.Types.ObjectId;
}

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
      max: 4, // adjust if needed
    },

    subjectCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    fileUrl: {
      type: String,
      required: true,
      trim: true,
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

export default mongoose.model<IResource>(
  "Resource",
  resourceSchema
);