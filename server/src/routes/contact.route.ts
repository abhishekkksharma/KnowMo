import { Router } from "express";
const { handleNewContact,handleGetContacts } = require("../controllers/contact.controller");

const router = Router();

router.post("/", handleNewContact);
router.get("/", handleGetContacts);


module.exports = router;