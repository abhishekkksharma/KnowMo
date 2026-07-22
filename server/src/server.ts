const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const { connectToMongoDB, syncExistingSubjects } = require("./connectMongo");

const PORT = Number(process.env.PORT) || 3000;
const MONGODB_URL:string = process.env.MONGODB_URL as string;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

connectToMongoDB(MONGODB_URL).then(async () => {
  console.log("MongoDB connected!");
 // await syncExistingSubjects();
});

export {};