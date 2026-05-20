import express from "express"
import authRouter from "./routes";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 8003;

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);

app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`);
})