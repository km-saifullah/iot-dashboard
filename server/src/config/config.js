import { configDotenv } from "dotenv";
configDotenv();

const dbURL = process.env.DB_URL;
const port = process.env.PORT;

export { dbURL, port };
