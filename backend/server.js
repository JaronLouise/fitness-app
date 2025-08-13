// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectMongo from './config/mongo.js';

dotenv.config();
const app = express();
app.use(cors());
connectMongo();

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
