# Quick Backend Setup Guide

## 🚀 Get Running in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
Create `.env` file in the backend directory:
```env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

### 3. Start the Server
```bash
npm run dev
```

### 4. Test the API
```bash
curl http://localhost:5000/health
```

## 🔧 What You Need

- **Supabase Project**: Create one at [supabase.com](https://supabase.com)
- **Database Schema**: Run the SQL in `database/schema.sql` in your Supabase SQL editor
- **Environment Variables**: Add your Supabase credentials to `.env`

## 📱 API Endpoints Ready

- `GET /health` - Server status
- `POST /api/user/profile` - Create user profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/signup-step` - Update signup step
- `POST /api/user/complete-signup` - Complete signup

## 🎯 Next Steps

1. **Test the backend**: Use the test script `node test-api.js`
2. **Connect frontend**: Update signup.jsx to use the new endpoints
3. **Create post-signup screens**: Build the 8-step wizard interface

## 🐛 Troubleshooting

- **Port already in use**: Change PORT in .env file
- **CORS errors**: Check your frontend URL
- **Database errors**: Verify Supabase schema is set up

## 📚 Full Documentation

See `README.md` for complete setup and API documentation.




