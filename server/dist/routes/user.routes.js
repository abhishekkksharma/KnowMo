"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { handleUserSignup } = require("../controllers/user");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.json({
        message: "Express server is working!"
    });
});
router.post("/signup", handleUserSignup);
module.exports = router;
//# sourceMappingURL=user.routes.js.map