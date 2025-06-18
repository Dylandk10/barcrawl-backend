import * as dotenv from "dotenv";
dotenv.config();

//exports for keys
export const ENV = {
    Port: process.env.Port,
    Database_url: process.env.Database_url,
    Database_key: process.env.Database_Service_Role_key,
    Database_Anon_key: process.env.Database_Anon_Key
};
