import express from "express"
import authRouter from "./routes";
import cookieParser from "cookie-parser";
import { customLogger } from "@digitalocean/logger";

const app = express();
const PORT = process.env.PORT || 8003;

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);

app.listen(PORT, () => {
    customLogger.info(`Auth Service running on port ${PORT}`);
})