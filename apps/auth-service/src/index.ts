import express from "express"
import authRouter from "./routes";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 8003;

app.use(express.json());
app.use(cookieParser());

// CORS debug: auth-service'in ne gönderdiğini gör
app.use((req, res, next) => {
  console.log('\n[AUTH-SERVICE CORS-DEBUG] → İstek');
  console.log('  method :', req.method);
  console.log('  path   :', req.path);
  console.log('  origin :', req.headers.origin ?? '(yok)');

  res.on('finish', () => {
    console.log('\n[AUTH-SERVICE CORS-DEBUG] ← Yanıt');
    console.log('  status :', res.statusCode);
    console.log('  acao   :', res.getHeader('access-control-allow-origin') ?? '(yok)');
    console.log('  acac   :', res.getHeader('access-control-allow-credentials') ?? '(yok)');
  });

  next();
});

app.use("/", authRouter);

app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`);
})