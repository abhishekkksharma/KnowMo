import mongoose, { Schema, Document } from "mongoose";

export interface IDepartment extends Document {
  name: string;
  departmentCode: string;

  description?: string;

  yearsOfDegree: number;

  totalSearches?: number;
  totalResources?: number;
  totalSubjects?: number;

  subjects?: mongoose.Types.ObjectId[];

  hod?: string;

  image?: string;
  banner?: string;

  isActive?: boolean;
}

const departmentSchema = new Schema<IDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    departmentCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },

    description: {
      type: String,
      default: "",
    },

    yearsOfDegree: {
      type: Number,
      default: 4,
    },

    totalSearches: {
      type: Number,
      default: 0,
    },

    totalResources: {
      type: Number,
      default: 0,
    },

    totalSubjects: {
      type: Number,
      default: 0,
    },
    subjects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],

    hod: String,

    image: String,

    banner: String,

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Departments = mongoose.model<IDepartment>(
  "Departments",
  departmentSchema
);
export default Departments