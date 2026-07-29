import { Request, Response } from "express";
import RequestModel from "../models/request.model";

async function handleNewDepartmentRequest(req: Request, res: Response) {
    try {
        const { departmentName, degreeYears, email } = req.body;

        if (!departmentName || !degreeYears || !email) {
            return res.status(400).json({
                success: false,
                message: "Department name, degree years, and email are required.",
            });
        }

        const request = await RequestModel.create({
            type: "Department",
            departmentName,
            degreeYears,
            email,
        });

        return res.status(201).json({
            success: true,
            message: "Department request submitted successfully.",
            data: request,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

async function handleNewSubjectRequest(req: Request, res: Response) {
    try {
        const { departmentCode, subjectName, year, email } = req.body;

        if (!departmentCode || !subjectName || !year || !email) {
            return res.status(400).json({
                success: false,
                message:
                    "Department code, subject name, year, and email are required.",
            });
        }

        const request = await RequestModel.create({
            type: "Subject",
            departmentCode,
            subjectName,
            year,
            email,
        });

        return res.status(201).json({
            success: true,
            message: "Subject request submitted successfully.",
            data: request,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

async function handleGetAllRequests(req: Request, res: Response) {
  try {
    const { type, status } = req.query;

    const filter: any = {};

    if (type) {
      if (!["Department", "Subject"].includes(type as string)) {
        return res.status(400).json({
          success: false,
          message: "Invalid type. Allowed values: Department, Subject",
        });
      }

      filter.type = type;
    }

    if (status) {
      if (!["Pending", "Approved", "Rejected"].includes(status as string)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid status. Allowed values: Pending, Approved, Rejected",
        });
      }

      filter.status = status;
    }

    const requests = await RequestModel.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

module.exports = {
    handleNewDepartmentRequest,
    handleNewSubjectRequest,
    handleGetAllRequests,
};