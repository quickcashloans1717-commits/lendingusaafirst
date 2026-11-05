import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Try server/.env relative to this file
dotenv.config({ path: path.resolve(__dirname, ".env") });

// 2. Try process.cwd()/server/.env
dotenv.config({ path: path.resolve(process.cwd(), "server", ".env") });

// 3. Try process.cwd()/.env (root)
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
