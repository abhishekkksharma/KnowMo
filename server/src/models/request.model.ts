import mongoose, { Schema, Document } from "mongoose";

export interface IRequest extends Document {
  type: "Department" | "Subject";

  // Common
  email: string;

  // Department Request
  departmentName?: string;
  degreeYears?: number;

  // Subject Request
  departmentCode?: string;
  subjectName?: string;
  year?: number;

  status: "Pending" | "Approved" | "Rejected";

  createdAt: Date;
  updatedAt: Date;
}

const RequestSchema = new Schema<IRequest>(
  {
    type: {
      type: String,
      enum: ["Department", "Subject"],
      required: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    // Department Request Fields
    departmentName: {
      type: String,
      trim: true,
    },

    degreeYears: {
      type: Number,
      enum: [2, 3, 4, 5],
    },

    // Subject Request Fields
    departmentCode: {
      type: String,
      trim: true,
      uppercase: true,
    },

    subjectName: {
      type: String,
      trim: true,
    },

    year: {
      type: Number,
      min: 1,
      max: 5,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IRequest>("Request", RequestSchema);