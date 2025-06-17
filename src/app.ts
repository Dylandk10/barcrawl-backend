import express from 'express';
import { HomeRoute } from './routes/HomeRoute';
import { ENV } from './env';
import cookieParser from 'cookie-parser';
import cors from 'cors';


const app = express();
const port = ENV.Port || 3000;

// For parsing application/json
app.use(express.json());
app.use(cookieParser())

app.use(
  cors({
    origin: 'http://localhost:5173', // or 'http://localhost:3000'
    credentials: true,              // Allow cookies to be sent
  })
);

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const homeRoute = new HomeRoute();
app.use('/', homeRoute.getRouter());

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


