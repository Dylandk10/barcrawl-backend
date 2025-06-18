import express from 'express';
import { HomeRoute } from './routes/HomeRoute';
import { SearchRoute } from './routes/SearchRoutes';
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


//map the routes
const homeRoute = new HomeRoute();
const searchRoute = new SearchRoute();
app.use('/', homeRoute.getRouter());
app.use('/search', searchRoute.getRouter());



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


