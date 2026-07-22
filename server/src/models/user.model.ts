import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;

  department: string;      
  departmentCode: string;   

  currentYear: number;
  credits: number;

  password: string;

  lastLogin?: Date;
  isAdmin: boolean;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    department: {
      type: String,
      trim: true,
    },

    departmentCode: {
      type: String,
      uppercase: true,
      trim: true,
      maxlength: 10,
    },

    currentYear: {
      type: Number,
      min: 1,
      max: 5,
    },

    credits: {
      type: Number,
      default: 0,
      min: 0,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    lastLogin: {
      type: Date,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// userSchema.index({ departmentCode: 1 });

const User = mongoose.model<IUser>("User", userSchema);

export default User;