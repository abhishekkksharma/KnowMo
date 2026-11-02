"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { handleUserSignup, handleSignIn, handleGetMe } = require("../controllers/user");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.json({
        message: "Express server is working!"
    });
});
router.post("/signup", handleUserSignup);
router.post("/login", handleSignIn);
router.get("/me", handleGetMe);
module.exports = router;
//# sourceMappingURL=user.routes.js.map