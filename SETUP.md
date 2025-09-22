# Health Planner - Complete Setup Guide

This guide will help you set up the complete Health Planner application with Firebase authentication and Python FastAPI backend.

## 🏗️ Architecture Overview

```
React Native App (Expo) ←→ Firebase Auth ←→ Python FastAPI Backend
     ↓                           ↓                    ↓
User Interface              Token Verification    Health Data API
```

## 📱 React Native App Setup

### 1. Install Dependencies
```bash
cd /Users/amar/HealthPlanner
npm install
```

### 2. Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project: "Health Planner"
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password authentication
4. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll down to "Your apps" and add a web app
   - Copy the config object

### 3. Update Firebase Config
Edit `firebase.js` and replace the placeholder values:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 4. Start the React Native App
```bash
npm start
```

## 🐍 Python Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 3. Firebase Admin SDK Setup
1. In Firebase Console, go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Save it as `service-account-key.json` in the backend directory
5. Set environment variable:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="path/to/service-account-key.json"
   ```

### 4. Start the Backend Server
```bash
python main.py
```

The API will be available at:
- **API**: http://localhost:8000
- **Documentation**: http://localhost:8000/docs

## 🔧 Configuration

### Update API URL in React Native App
Edit `services/api.js` and update the API_BASE_URL:

```javascript
const API_BASE_URL = 'http://localhost:8000'; // For local development
// const API_BASE_URL = 'https://your-railway-app.railway.app'; // For production
```

## 🚀 Testing the Complete Flow

### 1. Start Both Services
```bash
# Terminal 1: React Native App
npm start

# Terminal 2: Python Backend
cd backend
python main.py
```

### 2. Test Authentication Flow
1. Open Expo Go app on your phone
2. Scan the QR code
3. You should see the Login screen
4. Create a new account (Register)
5. After registration, you'll be taken to User Details screen
6. Complete the onboarding flow
7. You'll reach the main app with bottom navigation

### 3. Test API Integration
The app will automatically verify tokens with your Python backend when:
- User logs in
- App makes API calls
- User saves health data

## 📱 App Flow

### For New Users:
1. **Login Screen** → Register new account
2. **User Details** → Enter age, gender, height, weight
3. **Goal Screen** → Set target weight and timeline
4. **Main App** → Home, Calendar, Progress tabs

### For Returning Users:
1. **Login Screen** → Sign in with existing credentials
2. **Main App** → Direct access to all features

## 🔒 Security Features

- **Firebase Authentication**: Secure user authentication
- **Token Verification**: All API calls verified with Firebase tokens
- **Protected Routes**: Users can't access main app without authentication
- **Automatic Logout**: Users can logout and return to login screen

## 🚀 Deployment Options

### Local Development
- React Native: Expo Go app
- Backend: http://localhost:8000

### Production Deployment
1. **React Native**: Build for app stores
2. **Backend**: Deploy to Railway, Heroku, or AWS

### Railway Deployment (Recommended)
1. Create Railway account
2. Connect GitHub repository
3. Set environment variables
4. Deploy automatically

## 🐛 Troubleshooting

### Common Issues:

1. **Firebase Config Error**
   - Make sure you've updated `firebase.js` with correct config
   - Check that Authentication is enabled in Firebase Console

2. **Backend Connection Error**
   - Ensure Python backend is running on port 8000
   - Check that `API_BASE_URL` in `services/api.js` is correct

3. **Token Verification Error**
   - Make sure Firebase service account key is properly set
   - Check that `GOOGLE_APPLICATION_CREDENTIALS` environment variable is set

4. **Navigation Issues**
   - Users should only see auth screens when not logged in
   - Main app should only be accessible after authentication

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🎯 Next Steps

1. **Data Persistence**: Add Firestore for storing user data
2. **Push Notifications**: Implement workout reminders
3. **Social Features**: Add friend connections
4. **Analytics**: Add detailed progress tracking
5. **Production Deployment**: Deploy to app stores and cloud

## 📞 Support

If you encounter any issues:
1. Check the console logs in both React Native and Python
2. Verify Firebase configuration
3. Ensure all dependencies are installed
4. Check network connectivity between app and backend
