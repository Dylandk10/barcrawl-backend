import express from 'express';
import { HomeRoute } from './routes/HomeRoute';
import { ENV } from './env';


const app = express();
const port = ENV.Port || 3000;

// For parsing application/json
app.use(express.json());

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const homeRoute = new HomeRoute();
app.use('/', homeRoute.getRouter());

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


