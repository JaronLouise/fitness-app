// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectMongo from "./config/mongo.js";
import mainRoutes from './routes/main.route.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectMongo();

app.use('/', mainRoutes);

app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
