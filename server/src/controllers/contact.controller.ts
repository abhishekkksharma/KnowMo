import Contact from "../models/contact.model";
import { Request, Response } from "express";

async function handleNewContact(req: Request, res: Response) {
  try {
    const { name, email, subject, content } = req.body;

    if (!email || !subject || !content) {
      return res.status(400).json({
        success: false,
        message: "Email, subject and content are required.",
      });
    }

    const contact = await Contact.create({
      name,
      email,
      subject,
      content,
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      data: contact,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
}

async function handleGetContacts(req: Request, res: Response) {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
}

module.exports = {
    handleNewContact,
    handleGetContacts,
};