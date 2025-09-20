# 🚀 Health Planner - Firestore + Railway Deployment Guide

This guide will help you deploy your Health Planner app with Firebase Firestore as the database and Railway for backend hosting.

## 📋 **Prerequisites**

### **Required Accounts**
- [Firebase Console](https://console.firebase.google.com/) account
- [Railway](https://railway.app/) account
- [GitHub](https://github.com/) account (for code hosting)

### **Required Software**
- Node.js (for React Native development)
- Python 3.12+ (for backend)
- Git (for version control)

## 🔥 **Step 1: Firebase Firestore Setup**

### **1.1 Enable Firestore Database**

1. **Go to Firebase Console**
   - Visit [Firebase Console](https://console.firebase.google.com/)
   - Select your project: `health-planner-bf067`

2. **Enable Firestore**
   - Click on "Firestore Database" in the left sidebar
   - Click "Create database"
   - Choose "Start in production mode" (we'll set up security rules later)
   - Select a location (choose closest to your users)
   - Click "Done"

### **1.2 Set up Firestore Security Rules**

1. **Go to Firestore Rules**
   - In Firestore Database, click on "Rules" tab
   - Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Daily logs subcollection
      match /dailyLogs/{logId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Goals subcollection
      match /goals/{goalId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Workouts subcollection
      match /workouts/{workoutId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

2. **Publish the rules**
   - Click "Publish" to save the rules

### **1.3 Get Firebase Service Account Key**

1. **Go to Project Settings**
   - Click the gear icon → "Project settings"
   - Go to "Service accounts" tab

2. **Generate New Private Key**
   - Click "Generate new private key"
   - Download the JSON file
   - **IMPORTANT**: Keep this file secure and never commit it to public repositories

3. **Save the key**
   - Rename the file to `service-account-key.json`
   - Place it in your `backend/` directory
   - Add it to `.gitignore` (already done in your project)

## 🚂 **Step 2: Railway Deployment Setup**

### **2.1 Prepare Your Repository**

1. **Initialize Git** (if not already done)
```bash
cd /Users/amar/HealthPlanner
git init
git add .
git commit -m "Initial commit with Firestore integration"
```

2. **Create GitHub Repository**
   - Go to [GitHub](https://github.com/)
   - Click "New repository"
   - Name: `health-planner`
   - Make it private (recommended for health data)
   - Don't initialize with README (you already have files)

3. **Push to GitHub**
```bash
git remote add origin https://github.com/YOUR_USERNAME/health-planner.git
git branch -M main
git push -u origin main
```

### **2.2 Deploy to Railway**

1. **Sign up for Railway**
   - Go to [Railway](https://railway.app/)
   - Sign up with GitHub (recommended)

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `health-planner` repository

3. **Configure the Service**
   - Railway will detect it's a Python project
   - Select the `backend/` folder as the root directory
   - Railway will automatically use your `requirements.txt`

4. **Set Environment Variables**
   - Go to your project dashboard
   - Click on "Variables" tab
   - Add the following environment variables:

```
GOOGLE_APPLICATION_CREDENTIALS=/app/service-account-key.json
FIREBASE_PROJECT_ID=health-planner-bf067
```

5. **Upload Service Account Key**
   - In Railway dashboard, go to "Files" tab
   - Upload your `service-account-key.json` file
   - This will be available at `/app/service-account-key.json`

### **2.3 Deploy the Backend**

1. **Trigger Deployment**
   - Railway will automatically deploy when you push to GitHub
   - Or click "Deploy" in the Railway dashboard

2. **Check Deployment Status**
   - Go to "Deployments" tab
   - Wait for the build to complete
   - Check the logs for any errors

3. **Get Your API URL**
   - Once deployed, Railway will give you a URL like:
   - `https://your-app-name.railway.app`
   - Copy this URL - you'll need it for the frontend

## 📱 **Step 3: Update Frontend Configuration**

### **3.1 Update API Base URL**

1. **Update services/api.js**
```javascript
// Change the API_BASE_URL to your Railway URL
const API_BASE_URL = 'https://your-app-name.railway.app';
```

2. **Test the Connection**
   - Start your React Native app: `npm start`
   - Try registering a new user
   - Check Railway logs to see if the API calls are working

### **3.2 Update Firebase Configuration (if needed)**

Your Firebase configuration should already be correct, but verify in `firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDT5LrblAwtZ6MPKm_105pf7xqBn7g1EEI",
  authDomain: "health-planner-bf067.firebaseapp.com",
  projectId: "health-planner-bf067",
  storageBucket: "health-planner-bf067.firebasestorage.app",
  messagingSenderId: "909115902249",
  appId: "1:909115902249:web:9dfa4f732f9fe6e96b4f38",
  measurementId: "G-XJ3H4P70R5"
};
```

## 🧪 **Step 4: Testing Your Deployment**

### **4.1 Test Backend API**

1. **Check API Health**
   - Visit: `https://your-app-name.railway.app/`
   - You should see: `{"message": "Health Planner API is running!"}`

2. **Test API Documentation**
   - Visit: `https://your-app-name.railway.app/docs`
   - You should see the FastAPI interactive documentation

### **4.2 Test Frontend Integration**

1. **Start Your React Native App**
```bash
cd /Users/amar/HealthPlanner
npm start
```

2. **Test User Registration**
   - Fill out user details
   - Set goals
   - Create an account
   - Check Railway logs to see if data is being saved to Firestore

3. **Check Firestore Data**
   - Go to Firebase Console → Firestore Database
   - You should see a `users` collection with your test data

## 🔧 **Step 5: Production Optimizations**

### **5.1 Environment Variables**

Create a `.env` file for local development:

```bash
# .env (for local development)
API_BASE_URL=http://localhost:8000
FIREBASE_PROJECT_ID=health-planner-bf067
```

### **5.2 Railway Environment Variables**

In Railway dashboard, add these variables:

```
ENVIRONMENT=production
CORS_ORIGINS=https://your-frontend-domain.com
```

### **5.3 Update CORS Settings**

In your `backend/main.py`, update CORS origins for production:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8081",  # Expo development
        "https://your-frontend-domain.com",  # Production frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📊 **Step 6: Monitoring and Maintenance**

### **6.1 Railway Monitoring**

1. **Check Logs**
   - Go to Railway dashboard → "Deployments"
   - Click on your deployment to see logs
   - Monitor for errors or performance issues

2. **Set up Alerts**
   - Railway can send email alerts for deployment failures
   - Configure in project settings

### **6.2 Firebase Monitoring**

1. **Firestore Usage**
   - Go to Firebase Console → "Usage"
   - Monitor read/write operations
   - Check storage usage

2. **Authentication**
   - Monitor user sign-ups and sign-ins
   - Check for any authentication errors

## 🚨 **Troubleshooting Common Issues**

### **Issue 1: Railway Deployment Fails**

**Symptoms**: Build fails, deployment doesn't start

**Solutions**:
- Check Railway logs for specific error messages
- Ensure `requirements.txt` has all dependencies
- Verify Python version compatibility
- Check if service account key is properly uploaded

### **Issue 2: API Calls Fail from Frontend**

**Symptoms**: Network errors, 500 errors

**Solutions**:
- Verify Railway URL is correct in `services/api.js`
- Check CORS settings in backend
- Ensure Firebase service account key is valid
- Check Railway logs for backend errors

### **Issue 3: Firestore Permission Denied**

**Symptoms**: 403 errors when saving data

**Solutions**:
- Check Firestore security rules
- Ensure user is authenticated
- Verify Firebase configuration
- Check service account permissions

### **Issue 4: Slow API Response**

**Symptoms**: Long loading times

**Solutions**:
- Check Railway resource usage
- Optimize Firestore queries
- Consider upgrading Railway plan
- Add caching if needed

## 💰 **Cost Estimation**

### **Railway Costs**
- **Hobby Plan**: $5/month
- **Pro Plan**: $20/month (for higher usage)

### **Firebase Costs**
- **Free Tier**: 1GB storage, 50K reads, 20K writes
- **Blaze Plan**: Pay-as-you-go (starts at $0.18/GB)

### **Total Estimated Cost**: $5-25/month

## 🎯 **Next Steps**

### **Immediate Actions**
1. ✅ Deploy to Railway
2. ✅ Test user registration flow
3. ✅ Verify data persistence in Firestore
4. ✅ Update frontend API URL

### **Future Enhancements**
1. **Add more API endpoints** for daily logs, goals, workouts
2. **Implement real-time updates** using Firestore listeners
3. **Add data validation** and error handling
4. **Set up monitoring** and alerting
5. **Optimize performance** for production scale

## 📞 **Support Resources**

- **Railway Documentation**: https://docs.railway.app/
- **Firebase Documentation**: https://firebase.google.com/docs
- **FastAPI Documentation**: https://fastapi.tiangolo.com/
- **React Native Documentation**: https://reactnative.dev/

---

## 🎉 **Congratulations!**

You now have a fully deployed Health Planner app with:
- ✅ Firebase Authentication
- ✅ Firestore Database
- ✅ Railway Backend API
- ✅ React Native Frontend
- ✅ Production-ready architecture

Your app is ready for users! 🚀
