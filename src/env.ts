import * as dotenv from "dotenv";
dotenv.config();

//exports for keys
export const ENV = {
    Port: process.env.Port,
    Google_API_Key: process.env.Google_API_Key,
};
