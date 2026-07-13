import Update from "../models/updates.model";
import { Request, Response } from "express";

async function createUpdate(title: string,
    description: string) {
    try {
        const update = await Update.create({
            title,
            description,
        });

        return update;
    } catch (error) {
        console.error("Error creating update:", error);
        throw error;
    }
};


async function handleGetUpdates(
    req: Request,
    res: Response
) {
    try {
    const updates = await Update.find()
      .sort({ date: -1 }) 
      .limit(5);

    res.status(200).json({
      success: true,
      count: updates.length,
      updates,
    });
  } catch (error) {
    console.error("Error fetching updates:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch updates",
    });
  }
}

module.exports ={
    createUpdate,
    handleGetUpdates,
}