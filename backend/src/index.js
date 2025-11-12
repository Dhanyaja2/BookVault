import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import app from "./app.js";
import env from "./config/env.js";

// const port = process.env.PORT || 3000;
const port = env.PORT;

app.get("/", (req, res) => {
  res.send("API running successfully...");
});

await connectDB()
  .then(() => {
    app.listen(port, () =>
      console.log(`Server started on http://localhost:${port}`)
    );
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err);
    process.exit(1);
  });
