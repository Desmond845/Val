import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import helmet from "helmet";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import route from "./routes/routes.js";
import notFound from "./notFound.js";
import errorHandler from "./error.js";
import connectDB from "./db.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: "http://127.0.0.1:5500" }));
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src-attr": ["'unsafe-inline'"],
        },
    },
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/", route);
// );
app.use(errorHandler);

app.use(notFound);
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT} with MongoDB!`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });
