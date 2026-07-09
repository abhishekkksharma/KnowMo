"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const departmentRoutes = require("./routes/department.route");
const subjectRoutes = require("./routes/subject.route");
const searchesRoutes = require("./routes/searches.route");
const resourceRoutes = require("./routes/resource.route");
const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
}));
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Server running..");
});
app.use("/api/user", userRoutes);
app.use("/api/department", departmentRoutes);
app.use("/api/subject", subjectRoutes);
app.use("/api/search", searchesRoutes);
app.use("/api/resource", resourceRoutes);
app.use((req, res) => {
    res.status(404).render("404", {
        message: "The requested page could not be found"
    });
});
module.exports = app;
//# sourceMappingURL=app.js.map