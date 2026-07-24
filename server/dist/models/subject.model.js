"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const mcqSchema = new mongoose_1.Schema({
    question: {
        type: String,
        required: true,
        trim: true,
    },
    options: {
        type: [String],
        required: true,
        validate: {
            validator: (v) => v.length >= 2,
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
}, { _id: false });
const subjectSchema = new mongoose_1.Schema({
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Resource",
        },
    ],
    questionBank: {
        type: [mcqSchema],
        default: [],
    },
}, {
    timestamps: true,
});
const Subject = mongoose_1.default.model("Subject", subjectSchema);
exports.default = Subject;
//# sourceMappingURL=subject.model.js.map