import Resource from "../models/resource.model";
import Subject from "../models/subject.model";
import Departments from "../models/departments.model";
import mongoose from "mongoose";
import { Request, Response } from "express";
import fs from "fs/promises";
import { generateByImage } from "../services/gemini/generateByImage";
import { generateByPrompt } from "../services/gemini/generateByPrompt";


const { createUpdate } = require("./updates");

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}


async function handleAddNewResource(req: Request, res: Response) {
  try {
    const {
      title,
      type,
      customType,
      departmentCode,
      year,
      subjectCode,
      fileUrl,
      description,
      uploadedBy,
    } = req.body;

    // Required fields validation
    if (!title?.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!type) {
      return res.status(400).json({ message: "Type is required" });
    }
    if (!departmentCode?.trim()) {
      return res.status(400).json({ message: "Department code is required" });
    }
    if (year === undefined || year === null) {
      return res.status(400).json({ message: "Year is required" });
    }
    if (!subjectCode?.trim()) {
      return res.status(400).json({ message: "Subject code is required" });
    }
    if (!fileUrl?.trim()) {
      return res.status(400).json({ message: "File URL is required" });
    }

    // Check if the subject exists by subjectCode
    const subject = await Subject.findOne({
      subjectCode: subjectCode.trim().toUpperCase(),
    });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // Create update BEFORE saving resource
    await createUpdate(
      `Resource added for ${subject.name || subject.subjectCode}`,
      `${type}${customType ? ` (${customType})` : ""} added for ${subject.name || subject.subjectCode
      }`
    );


    // Create the resource
    const newResource = await Resource.create({
      title: title.trim(),
      type,
      customType: customType?.trim() || null,
      departmentCode: departmentCode.trim().toUpperCase(),
      year,
      subjectCode: subjectCode.trim().toUpperCase(),
      fileUrl: fileUrl.trim(),
      description: description?.trim(),
      uploadedBy: uploadedBy || null,
    });

    // Add resource ID to subject's resources array and update resourceCount
    if (!subject.resources) {
      subject.resources = [];
    }
    subject.resources.push(newResource._id as mongoose.Types.ObjectId);
    subject.resourceCount = subject.resources.length;
    await subject.save();

    return res.status(201).json({
      message: "Resource added successfully",
      resource: newResource,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to add resource" });
  }
}

async function handleGetResourcesBySubjectCode(
  req: Request<{ subjectCode: string }>,
  res: Response
) {
  try {
    const { subjectCode } = req.params;

    if (!subjectCode?.trim()) {
      return res.status(400).json({ message: "Subject code is required" });
    }

    const upperSubjectCode = subjectCode.trim().toUpperCase();

    // Fetch the subject to verify it exists
    const subject = await Subject.findOne({ subjectCode: upperSubjectCode });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // Fetch the department to get the department name
    const department = await Departments.findOne({ departmentCode: subject.departmentCode });

    // Fetch all resources with this subjectCode
    const resources = await Resource.find({ subjectCode: upperSubjectCode });

    return res.status(200).json({
      resources,
      subject,
      departmentName: department ? department.name : subject.departmentCode
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch resources" });
  }
}

async function handleGetTestMcqs(req: Request<{ subjectCode: string }>, res: Response) {
  try {
    const { subjectCode } = req.params;
    const count = Number(req.query.count);

    const resource = await Resource.findOne({
      subjectCode: subjectCode.toUpperCase(),
      type: "mcqs",
    }).select("questionBank");

    if (!resource || !resource.questionBank) {
      return res.status(404).json({
        success: false,
        message: "MCQs not found.",
      });
    }

    let questions = [...resource.questionBank];

    // Shuffle and return only `count` questions if requested
    if (!isNaN(count) && count > 0) {
      questions = questions.sort(() => Math.random() - 0.5).slice(0, count);
    }

    // Hide correct answers for the test
    const testQuestions = questions.map((q) => ({
      question: q.question,
      options: q.options,
    }));

    return res.status(200).json({
      success: true,
      total: testQuestions.length,
      data: testQuestions,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

async function handleAddMcqs(req: Request, res: Response) {
  try {
    const { subjectCode, questions } = req.body;

    if (!subjectCode) {
      return res.status(400).json({
        success: false,
        message: "Subject code is required.",
      });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Questions must be a non-empty array.",
      });
    }

    const resource = await Resource.findOneAndUpdate(
  {
    subjectCode: subjectCode.toUpperCase(),
    type: "mcqs",
  },
  {
    $setOnInsert: {
      title: `${subjectCode.toUpperCase()} MCQs`,
      departmentCode: req.body.departmentCode,
      year: req.body.year,
      type: "mcqs",
      subjectCode: subjectCode.toUpperCase(),
    },
    $push: {
      questionBank: {
        $each: questions,
      },
    },
  },
  {
    new: true,
    upsert: true,
  }
);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "MCQ resource not found for this subject.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `${questions.length} question(s) added successfully.`,
      totalQuestions: resource.questionBank?.length || 0,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}


async function handleGenerateTest(
    req: MulterRequest,
    res: Response
) {
    try {
        const { prompt, numberOfQuestions } = req.body;
        const image = req.file;

        const totalQuestions = Number(numberOfQuestions) || 20;

        let mcqs;

        if (image) {
            mcqs = await generateByImage(image.path, totalQuestions);

            // Delete uploaded image after processing
            await fs.unlink(image.path).catch(() => {});
        } else if (prompt) {
            mcqs = await generateByPrompt(prompt, totalQuestions);
        } else {
            return res.status(400).json({
                success: false,
                message: "Please provide either a syllabus image or a prompt.",
            });
        }

        return res.status(200).json({
            success: true,
            total: mcqs.length,
            data: mcqs,
        });
    } catch (error) {
        console.error("Generate Test Error:", error);

        // Clean up uploaded file if an error occurs
        if (req.file) {
            await fs.unlink(req.file.path).catch(() => {});
        }

        return res.status(500).json({
            success: false,
            message: "Failed to generate MCQs.",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}

module.exports = {
  handleAddNewResource,
  handleGetResourcesBySubjectCode,
  handleGetTestMcqs,
  handleAddMcqs,
  handleGenerateTest,
};
