import Departments from "../models/departments.model";
import { Request, Response } from "express";

async function handleGetDepartments(req: Request, res: Response) {
  try {
    // const departments = await Departments.find().populate("subjects");
    const departments = await Departments.find()
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

module.exports = {
  handleGetDepartments,
  handleAddDepartment,
};
