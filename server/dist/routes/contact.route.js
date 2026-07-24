"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { handleNewContact, handleGetContacts } = require("../controllers/contact.controller");
const router = (0, express_1.Router)();
router.post("/", handleNewContact);
router.get("/", handleGetContacts);
module.exports = router;
//# sourceMappingURL=contact.route.js.map