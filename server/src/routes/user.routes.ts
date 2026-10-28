import { Router } from "express";
const { handleUserSignup, handleSignIn, handleGetMe } = require("../controllers/user");

const router = Router();

router.get("/", (req, res) => {
  res.json({
    message: "Express server is working!"
  });
});

router.post("/signup", handleUserSignup);
router.post("/login", handleSignIn);
router.get("/me", handleGetMe);


module.exports = router;