import Subject from "../models/subject.model";
import Departments from "../models/departments.model";
import mongoose from "mongoose";
import { Request, Response } from "express";

async function handleAddNewSubject(
  req: Request,
  res: Response
) {
  try {
    const {
      name,
      departmentCode,
      year,
      semester,
      subjectCode,
    } = req.body;

    // Required field validation
    if (!name?.trim()) {
      return res.status(400).json({
        message: "Subject name is required",
      });
    }

    if (!departmentCode?.trim()) {
      return res.status(400).json({
        message: "Department code is required",
      });
    }

    if (!year) {
      return res.status(400).json({
        message: "Year is required",
      });
    }

    if (!subjectCode?.trim()) {
      return res.status(400).json({
        message: "Subject code is required",
      });
    }

    if (semester && (semester < 1 || semester > 8)) {
      return res.status(400).json({
        message: "Semester must be between 1 and 8",
      });
    }

    // Find the department with the matching departmentCode
    const department = await Departments.findOne({
      departmentCode: departmentCode.trim().toUpperCase(),
    });

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    // Check duplicate subject code
    const existingSubject = await Subject.findOne({
      subjectCode: subjectCode.toUpperCase(),
    });

    if (existingSubject) {
      return res.status(409).json({
        message: "Subject with this code already exists",
      });
    }

    const subject = await Subject.create({
      name: name.trim(),
      departmentCode: departmentCode.toUpperCase(),
      year,
      semester,
      subjectCode: subjectCode.toUpperCase(),
    });

    // Add subject to department's subjects array and update totalSubjects count
    if (!department.subjects) {
      department.subjects = [];
    }
    department.subjects.push(subject._id as mongoose.Types.ObjectId);
    department.totalSubjects = department.subjects.length;
    await department.save();

    return res.status(201).json({
      message: "Subject created successfully",
      subject,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create subject",
    });
  }
}

async function handleGetAllSubjects(req: Request, res: Response) {
  try {
    // Exclude questionBank to avoid sending heavy data and save bandwidth
    const subjects = await Subject.find().select("-questionBank").sort({ createdAt: -1 });
    return res.status(200).json({ subjects });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch subjects",
    });
  }
}

async function handleGetSubjects(
    req: Request<{ departmentCode: string }>,
    res: Response
) {
    try {
        const { departmentCode } = req.params;
        await Departments.updateOne(
            { departmentCode: departmentCode },
            { $inc: { totalSearches: 1 } }
        );

        // Exclude questionBank to save bandwidth
        const subjects = await Subject.find({ departmentCode }).select("-questionBank");

        return res.status(200).json({ subjects });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch subjects",
        });
    }
}

async function handleGetSubjectById(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    let subject;

    if (mongoose.Types.ObjectId.isValid(id)) {
      subject = await Subject.findById(id).select("-questionBank").populate("resources");
    } else {
      subject = await Subject.findOne({
        subjectCode: id.trim().toUpperCase(),
      }).select("-questionBank").populate("resources");
    }

    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    // Get question bank count without returning the questions themselves
    const rawSubject = await Subject.findById(subject._id).select("questionBank");
    const questionBankCount = rawSubject?.questionBank?.length || 0;

    return res.status(200).json({
      success: true,
      data: subject,
      questionBankCount,
    });
  } catch (error: any) {
    console.error("Get Subject By ID Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch subject", error: error.message });
  }
}

async function handleUpdateSubject(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const { name, departmentCode, year, semester, subjectCode } = req.body;

    const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { subjectCode: id.trim().toUpperCase() };

    // Check if new subjectCode already exists on another subject
    if (subjectCode) {
      const existing = await Subject.findOne({
        subjectCode: subjectCode.trim().toUpperCase(),
        _id: { $ne: query._id || undefined },
      });
      if (existing && existing._id.toString() !== id) {
        return res.status(409).json({
          success: false,
          message: "Another subject with this subject code already exists",
        });
      }
    }

    const updated = await Subject.findOneAndUpdate(
      query,
      {
        $set: {
          ...(name && { name: name.trim() }),
          ...(departmentCode && { departmentCode: departmentCode.trim().toUpperCase() }),
          ...(year !== undefined && { year: Number(year) }),
          ...(semester !== undefined && { semester: Number(semester) }),
          ...(subjectCode && { subjectCode: subjectCode.trim().toUpperCase() }),
        },
      },
      { new: true }
    ).select("-questionBank");

    if (!updated) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Subject updated successfully",
      data: updated,
    });
  } catch (error: any) {
    console.error("Update Subject Error:", error);
    return res.status(500).json({ success: false, message: "Failed to update subject", error: error.message });
  }
}

module.exports = {
    handleAddNewSubject,
    handleGetSubjects,
    handleGetAllSubjects,
    handleGetSubjectById,
    handleUpdateSubject,
};
