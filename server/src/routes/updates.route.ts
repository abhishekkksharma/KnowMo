import express from "express";
import Update from "../models/updates.model"; 
const {handleGetUpdates} = require("../controllers/updates")

const router = express.Router();

router.get("/latest",handleGetUpdates);

module.exports = router;