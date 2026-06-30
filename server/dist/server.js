"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const app = require("./app");
const { connectToMongoDB, syncExistingSubjects } = require("./connectMongo");
dotenv.config();
const PORT = Number(process.env.PORT) || 3000;
const MONGODB_URL = process.env.MONGODB_URL;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
connectToMongoDB(MONGODB_URL).then(async () => {
    console.log("MongoDB connected!");
    await syncExistingSubjects();
});
//# sourceMappingURL=server.js.map