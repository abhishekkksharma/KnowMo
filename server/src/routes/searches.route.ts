import { Router } from "express";
const {handleSearch} = require("../controllers/searches")

const router = Router();


router.get("/", handleSearch);


module.exports = router;