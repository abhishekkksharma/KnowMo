import Subject from "../models/subject.model";
import Departments from "../models/departments.model";
import { Request, Response } from "express";


async function handleSearch(req: Request, res: Response) {
    try {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const searchRegex = new RegExp(q.trim(), "i");

    const isDeptCode = await Departments.exists({
      departmentCode: q.trim().toUpperCase(),
    });

    const subjectQuery = isDeptCode
      ? { name: searchRegex }
      : {
          $or: [
            { name: searchRegex },
            { subjectCode: searchRegex },
          ],
        };

    const [departments, subjects] = await Promise.all([
      Departments.find({
        $or: [
          { name: searchRegex },
          { departmentCode: searchRegex },
        ],
      })
        .select("name departmentCode")
        .lean(),

      Subject.find(subjectQuery)
        .select("name subjectCode departmentCode year semester")
        .lean(),
    ]);

    return res.status(200).json({
      success: true,
      query: q,
      results: {
        departments,
        subjects,
      },
      totalResults: departments.length + subjects.length,
    });
  } catch (error) {
    console.error("Search Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports={
    handleSearch,
}