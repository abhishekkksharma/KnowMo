const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const departmentRoutes = require("./routes/department.route");
const subjectRoutes = require("./routes/subject.route");
const searchesRoutes = require("./routes/searches.route");
const resourceRoutes = require("./routes/resource.route");
const updatesRoute = require("./routes/updates.route");
const contactRoute = require("./routes/contact.route");

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
}));
app.use(express.json());

app.get("/",(req:any,res:any)=>{
    res.send("Server running..")
});

app.use("/api/user", userRoutes);
app.use("/api/department", departmentRoutes);
app.use("/api/subject",subjectRoutes);
app.use("/api/search",searchesRoutes);
app.use("/api/resource", resourceRoutes);
app.use("/api/updates",updatesRoute);
app.use("/api/contact",contactRoute);

app.use((req:any, res:any) => {
    res.status(404).json({
        message: "The requested page could not be found"
    });
});


module.exports = app;

export {}