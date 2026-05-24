import express from "express"
import authRouter from "./routes";
import cookieParser from "cookie-parser";
import { customLogger } from "@digitalocean/logger";
import { producer } from "./utils/kafka.js";

const app = express();
const PORT = process.env.PORT || 8003;

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);

const start = async () => {
    try {
        await producer.connect();
        customLogger.info("Auth service Kafka producer connected");
    } catch (err) {
        customLogger.error({ err }, "Auth service Kafka producer connection failed");
    }

    app.listen(PORT, () => {
        customLogger.info(`Auth Service running on port ${PORT}`);
    });
};

start();