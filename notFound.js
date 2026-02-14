import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname,  "public")

const notFound = (req, res, next) => {
    res.sendFile(path.join(publicPath, "/404.html"));
};
export default notFound;
