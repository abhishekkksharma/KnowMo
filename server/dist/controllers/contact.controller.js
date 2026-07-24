"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const contact_model_1 = __importDefault(require("../models/contact.model"));
async function handleNewContact(req, res) {
    try {
        const { name, email, subject, content } = req.body;
        if (!email || !subject || !content) {
            return res.status(400).json({
                success: false,
                message: "Email, subject and content are required.",
            });
        }
        const contact = await contact_model_1.default.create({
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong.",
        });
    }
}
async function handleGetContacts(req, res) {
    try {
        const contacts = await contact_model_1.default.find({}).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts,
        });
    }
    catch (error) {
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
//# sourceMappingURL=contact.controller.js.map