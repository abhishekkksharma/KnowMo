import User from "../models/user.model";
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;


export async function handleUserSignup(req: any, res: any) {
  try {
    const { name, email, password, department, departmentCode, currentYear } =
      req.body;

    if (
      !name ||
      !email ||
      !password ||
      !department ||
      !departmentCode ||
      !currentYear
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (!email.endsWith("@chitkara.edu.in")) {
      return res.status(400).json({
        success: false,
        message: "Please use your college email ID (@chitkara.edu.in)",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      department,
      departmentCode,
      currentYear,
      credits: 0,
      isAdmin: false,
    });

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      user,
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
  handleUserSignup,
};
