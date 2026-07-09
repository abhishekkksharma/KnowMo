"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { handleSearch } = require("../controllers/searches");
const router = (0, express_1.Router)();
router.get("/", handleSearch);
module.exports = router;
//# sourceMappingURL=searches.route.js.map