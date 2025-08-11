import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import connectMongo from './config/mongo.js';
import supabase from './config/supabase.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectMongo();

// Example Supabase usage
app.get('/supabase-test', async (req, res) => {
  const { data, error } = await supabase.from('image').select('*');

  console.log('Supabase Data:', data);
  console.log('Supabase Error:', error);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});


// Start server
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
