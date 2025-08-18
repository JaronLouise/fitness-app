// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import supabase from './config/supabase.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Fitness App Backend is running' });
});

// User profile endpoints
app.post('/api/user/profile', authenticateUser, async (req, res) => {
  try {
    const { user } = req;
    const profileData = req.body;

    // Create or update user profile
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        email: user.email,
        signup_completed: false,
        signup_step: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Profile creation error:', error);
      return res.status(500).json({ error: 'Failed to create user profile' });
    }

    res.json({ 
      success: true, 
      profile: data,
      message: 'User profile created successfully' 
    });
  } catch (error) {
    console.error('Profile endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update signup step
app.put('/api/user/signup-step', authenticateUser, async (req, res) => {
  try {
    const { user } = req;
    const { step, data } = req.body;

    if (step < 0 || step > 7) {
      return res.status(400).json({ error: 'Invalid step number' });
    }

    // Update the signup step and store step-specific data
    const updateData = {
      signup_step: step,
      updated_at: new Date().toISOString()
    };

    // Add step-specific data to the appropriate column
    if (data) {
      switch (step) {
        case 0:
          updateData.step_0_data = data;
          break;
        case 1:
          updateData.step_1_data = data;
          break;
        case 2:
          updateData.step_2_data = data;
          break;
        case 3:
          updateData.step_3_data = data;
          break;
        case 4:
          updateData.step_4_data = data;
          break;
        case 5:
          updateData.step_5_data = data;
          break;
        case 6:
          updateData.step_6_data = data;
          break;
        case 7:
          updateData.step_7_data = data;
          updateData.signup_completed = true;
          break;
      }
    }

    const { data: updatedProfile, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Step update error:', error);
      return res.status(500).json({ error: 'Failed to update signup step' });
    }

    res.json({ 
      success: true, 
      profile: updatedProfile,
      message: `Step ${step} completed successfully` 
    });
  } catch (error) {
    console.error('Step update endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile
app.get('/api/user/profile', authenticateUser, async (req, res) => {
  try {
    const { user } = req;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Profile doesn't exist, create one
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            email: user.email,
            signup_completed: false,
            signup_step: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) {
          console.error('Profile creation error:', createError);
          return res.status(500).json({ error: 'Failed to create user profile' });
        }

        return res.json({ 
          success: true, 
          profile: newProfile,
          message: 'New profile created' 
        });
      }
      
      console.error('Profile fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch user profile' });
    }

    res.json({ 
      success: true, 
      profile: data 
    });
  } catch (error) {
    console.error('Profile fetch endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Complete signup process
app.post('/api/user/complete-signup', authenticateUser, async (req, res) => {
  try {
    const { user } = req;
    const { finalData } = req.body;

    // Update profile with final step data and mark as completed
    const { data: completedProfile, error } = await supabase
      .from('user_profiles')
      .update({
        signup_completed: true,
        signup_step: 7,
        step_7_data: finalData,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Signup completion error:', error);
      return res.status(500).json({ error: 'Failed to complete signup' });
    }

    res.json({ 
      success: true, 
      profile: completedProfile,
      message: 'Signup process completed successfully' 
    });
  } catch (error) {
    console.error('Signup completion endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log('- GET  /health');
  console.log('- POST /api/user/profile');
  console.log('- GET  /api/user/profile');
  console.log('- PUT  /api/user/signup-step');
  console.log('- POST /api/user/complete-signup');
});
