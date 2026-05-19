import express from "express"
import cors from "cors"

const app = express();
const PORT = process.env.PORT || 8003;

app.use(cors({
    origin:[
        "http://localhost:3001",
        "http://localhost:8000", 
        "http://localhost:8001", 
        "http://localhost:8002"
    ],
    credentials: true
}));


app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`);
})