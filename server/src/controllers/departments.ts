import Departments from "../models/departments.model";
import mongoose from "mongoose";
import { Request, Response } from "express";

async function handleGetDepartments(req: Request, res: Response) {
  try {
    const departments = await Departments.find();
    return res.status(200).json(departments);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch departments",
    });
  }
}

async function handleAddDepartment(req: Request, res: Response): Promise<void> {
  try {
    const {
      name,
      departmentCode,
      description,
      yearsOfDegree,
      hod,
      image,
      banner,
      isActive,
    } = req.body;

    // Validation
    if (!name || !departmentCode) {
      res.status(400).json({
        success: false,
        message: "Name and departmentCode are required",
      });
      return;
    }

    // Check existing department
    const existingDepartment = await Departments.findOne({
      $or: [
        { name: name.trim() },
        { departmentCode: departmentCode.trim().toUpperCase() },
      ],
    });

    if (existingDepartment) {
      res.status(409).json({
        success: false,
        message:
          existingDepartment.name === name
            ? "Department name already exists"
            : "Department code already exists",
      });
      return;
    }

    // Create department
    const department = await Departments.create({
      name: name.trim(),
      departmentCode: departmentCode.trim().toUpperCase(),
      description,
      yearsOfDegree,
      hod,
      image,
      banner,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: department,
    });
  } catch (error: any) {
    console.error("Add Department Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create department",
      error: error.message,
    });
  }
}

async function handleGetDepartmentById(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    let department;

    if (mongoose.Types.ObjectId.isValid(id)) {
      department = await Departments.findById(id).populate({
        path: "subjects",
        select: "-questionBank",
      });
    } else {
      department = await Departments.findOne({
        departmentCode: id.trim().toUpperCase(),
      }).populate({
        path: "subjects",
        select: "-questionBank",
      });
    }

    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    return res.status(200).json({ success: true, data: department });
  } catch (error: any) {
    console.error("Get Department By ID Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch department", error: error.message });
  }
}

async function handleUpdateDepartment(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const {
      name,
      departmentCode,
      description,
      yearsOfDegree,
      hod,
      image,
      banner,
      isActive,
    } = req.body;

    const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { departmentCode: id.trim().toUpperCase() };

    // Check duplicate if updating code or name
    if (departmentCode || name) {
      const existing = await Departments.findOne({
        $or: [
          ...(name ? [{ name: name.trim() }] : []),
          ...(departmentCode ? [{ departmentCode: departmentCode.trim().toUpperCase() }] : []),
        ],
        _id: { $ne: query._id || undefined },
      });
      if (existing && existing._id.toString() !== id) {
        return res.status(409).json({
          success: false,
          message:
            existing.name === name
              ? "Department name already in use by another department"
              : "Department code already in use by another department",
        });
      }
    }

    const updated = await Departments.findOneAndUpdate(
      query,
      {
        $set: {
          ...(name && { name: name.trim() }),
          ...(departmentCode && { departmentCode: departmentCode.trim().toUpperCase() }),
          ...(description !== undefined && { description: description.trim() }),
          ...(yearsOfDegree !== undefined && { yearsOfDegree: Number(yearsOfDegree) }),
          ...(hod !== undefined && { hod: hod.trim() }),
          ...(image !== undefined && { image }),
          ...(banner !== undefined && { banner }),
          ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: updated,
    });
  } catch (error: any) {
    console.error("Update Department Error:", error);
    return res.status(500).json({ success: false, message: "Failed to update department", error: error.message });
  }
}

module.exports = {
  handleGetDepartments,
  handleAddDepartment,
  handleGetDepartmentById,
  handleUpdateDepartment,
};
