"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const updates_model_1 = __importDefault(require("../models/updates.model"));
async function createUpdate(title, description) {
    try {
        const update = await updates_model_1.default.create({
            title,
            description,
        });
        return update;
    }
    catch (error) {
        console.error("Error creating update:", error);
        throw error;
    }
}
;
async function handleGetUpdates(req, res) {
    try {
        const updates = await updates_model_1.default.find()
            .sort({ date: -1 })
            .limit(5);
        res.status(200).json({
            success: true,
            count: updates.length,
            updates,
        });
    }
    catch (error) {
        console.error("Error fetching updates:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch updates",
        });
    }
}
module.exports = {
    createUpdate,
    handleGetUpdates,
};
//# sourceMappingURL=updates.js.map