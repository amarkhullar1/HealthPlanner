# Health Planner API

A FastAPI backend service for the Health Planner React Native app that verifies Firebase ID tokens and manages health data.

## Features

- **Firebase Authentication**: Verify Firebase ID tokens
- **Health Data Management**: Save and retrieve user health data
- **CORS Support**: Configured for React Native app
- **Token Verification**: Secure endpoint protection
- **RESTful API**: Clean API design with FastAPI

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Go to Project Settings > Service Accounts
4. Generate a new private key (JSON file)
5. Save as `service-account-key.json` in this directory
6. Set environment variable:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="path/to/service-account-key.json"
   ```

### 3. Run the Server

```bash
python main.py
```

Or use the setup script:
```bash
python setup.py
```

## API Endpoints

### Authentication
- `POST /verify-token` - Verify Firebase ID token
- `GET /user-profile` - Get user profile (requires auth)

### Health Data
- `POST /health-data` - Save health data (requires auth)
- `GET /health-data` - Get health data (requires auth)

### Utility
- `GET /` - Root endpoint
- `GET /health` - Health check

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Usage in React Native

The React Native app uses the `ApiService` class to communicate with this backend:

```javascript
import ApiService from './services/api';

// Verify token
const response = await ApiService.verifyToken();

// Save health data
const healthData = {
  weight: 70.5,
  steps: 8500,
  calories: 1800,
  workout_completed: true,
  date: "2024-01-01"
};
await ApiService.saveHealthData(healthData);
```

## Deployment

### Local Development
- Server runs on `http://localhost:8000`
- Update `API_BASE_URL` in React Native app's `services/api.js`

### Production (Railway)
1. Create Railway account
2. Connect GitHub repository
3. Set environment variables:
   - `GOOGLE_APPLICATION_CREDENTIALS`
   - Firebase service account JSON as environment variable
4. Deploy

## Environment Variables

- `GOOGLE_APPLICATION_CREDENTIALS`: Path to Firebase service account key
- `PORT`: Server port (default: 8000)

## Security Notes

- All protected endpoints require valid Firebase ID token
- CORS is configured for React Native app
- Tokens are verified using Firebase Admin SDK
- No sensitive data is stored in the API (use Firebase Firestore for data persistence)

## Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Run tests (when implemented)
pytest
```
