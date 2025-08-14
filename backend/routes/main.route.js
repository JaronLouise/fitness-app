import express from 'express';
import authRoutes from './authentication/auth.route.js';

const router = express.Router();

// /login
router.use('/auth', authRoutes);

export default router;
