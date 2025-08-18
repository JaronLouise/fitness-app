# Fitness App Backend

This is the backend server for the fitness application that handles user authentication, profile management, and the 8-step post-signup process.

## Features

- User authentication with Supabase
- User profile management
- 8-step post-signup flow
- RESTful API endpoints
- JWT-based authentication
- Google OAuth integration

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database Configuration (if using separate database)
DATABASE_URL=your_database_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:19006

# Google OAuth (for Google signup)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# App Configuration
APP_SCHEME=your-app-scheme
REDIRECT_URL=your_redirect_url_for_oauth
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

Run the SQL schema in your Supabase database:

```sql
-- Copy the contents of database/schema.sql and run it in your Supabase SQL editor
```

### 4. Start the Server

```bash
npm start
# or
node server.js
```

## API Endpoints

### Authentication Required Endpoints

All endpoints below require a valid JWT token in the Authorization header:
`Authorization: Bearer <your_jwt_token>`

#### User Profile Management

- `POST /api/user/profile` - Create initial user profile
- `GET /api/user/profile` - Get user profile (creates one if doesn't exist)
- `PUT /api/user/signup-step` - Update signup step with data
- `POST /api/user/complete-signup` - Complete the signup process

#### Health Check

- `GET /health` - Server health status

## Database Schema

The `user_profiles` table stores user information across 8 signup steps:

- `step_0_data`: Basic personal information (name, age, gender)
- `step_1_data`: Physical measurements (height, weight, unit system)
- `step_2_data`: Fitness goals and objectives
- `step_3_data`: Activity level and fitness experience
- `step_4_data`: Health conditions and medical restrictions
- `step_5_data`: Dietary preferences and restrictions
- `step_6_data`: Schedule availability and workout preferences
- `step_7_data`: Final preferences and onboarding completion

## Signup Flow

1. **Phase 1**: User creates account with email/password or Google OAuth
2. **Phase 2**: 8-step post-signup process to collect user profile information
3. **Completion**: User is redirected to the main application

## Security Features

- JWT-based authentication
- Row Level Security (RLS) in Supabase
- Input validation and sanitization
- CORS protection
- Rate limiting (can be added)

## Development

### Project Structure

```
backend/
├── config/
│   ├── mongo.js
│   └── supabase.js
├── database/
│   └── schema.sql
├── server.js
├── package.json
└── README.md
```

### Adding New Endpoints

1. Add the route in `server.js`
2. Use the `authenticateUser` middleware for protected routes
3. Follow the existing error handling pattern
4. Update this README with endpoint documentation

## Troubleshooting

### Common Issues

1. **CORS errors**: Check your CORS_ORIGIN configuration
2. **Authentication failures**: Verify your Supabase credentials
3. **Database errors**: Ensure the schema is properly set up in Supabase

### Logs

The server logs all API requests and errors. Check the console output for debugging information.

## Next Steps

After completing the backend setup:

1. Test all API endpoints
2. Set up the frontend post-signup flow
3. Implement the 8-step user onboarding process
4. Add additional features like workout tracking, progress monitoring, etc.




