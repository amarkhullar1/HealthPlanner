# Health Planner - Tips & Tricks Guide

A comprehensive guide for working with your Health Planner project, including pyenv, development workflows, and troubleshooting.

## 🐍 Python Environment (pyenv) Tips

### **Automatic Activation**
```bash
# Navigate to project directory
cd /Users/amar/HealthPlanner

# Environment automatically activates
python --version  # Shows Python 3.12.0
which python      # Shows pyenv path
```

### **Manual Environment Control**
```bash
# Check current environment
pyenv version

# List all environments
pyenv versions

# Activate manually (if needed)
pyenv activate health-planner

# Deactivate environment
pyenv deactivate

# Switch back to system Python
pyenv shell system
```

### **Installing Python Packages**
```bash
# Always install in project directory
cd /Users/amar/HealthPlanner/backend
pip install package-name

# Or install from requirements
pip install -r requirements.txt

# Check installed packages
pip list
```

## 🚀 Development Workflow

### **Starting Both Services**
```bash
# Terminal 1: React Native App
cd /Users/amar/HealthPlanner
npm start

# Terminal 2: Python Backend
cd /Users/amar/HealthPlanner/backend
python main.py
```

### **Quick Commands**
```bash
# Check if backend is running
curl http://localhost:8000/health

# View API documentation
open http://localhost:8000/docs

# Check React Native app
# Scan QR code with Expo Go app
```

## 🔧 Environment Management

### **Project Structure**
```
/Users/amar/HealthPlanner/
├── 📱 React Native (Frontend)
│   ├── screens/          # App screens
│   ├── contexts/         # Auth context
│   ├── services/      # API service
│   └── firebase.js        # Firebase config
├── 🐍 Python Backend
│   ├── main.py           # FastAPI server
│   ├── requirements.txt  # Python dependencies
│   └── README.md         # Backend docs
└── 📚 Documentation
    ├── SETUP.md          # Complete setup
    ├── TIPS.md           # This file
    └── README.md         # Project overview
```

### **Environment Isolation**
- ✅ **Python**: Uses pyenv `health-planner` environment
- ✅ **Node.js**: Uses npm in project root
- ✅ **No conflicts**: Completely separate runtimes
- ✅ **Clean dependencies**: Each has its own package manager

## 🐛 Troubleshooting

### **Common Issues & Solutions**

#### **1. Python Environment Issues**
```bash
# Problem: Wrong Python version
# Solution: Check environment
pyenv version
pyenv local health-planner

# Problem: Package not found
# Solution: Install in correct environment
cd /Users/amar/HealthPlanner/backend
pip install package-name
```

#### **2. React Native Issues**
```bash
# Problem: Metro bundler issues
# Solution: Clear cache and restart
npx expo start --clear

# Problem: Package version conflicts
# Solution: Update packages
npm update

# Problem: Expo Go connection issues
# Solution: Check network, restart Expo
```

#### **3. Backend Connection Issues**
```bash
# Problem: API not responding
# Solution: Check if backend is running
curl http://localhost:8000/health

# Problem: CORS errors
# Solution: Check backend CORS settings
# Problem: Firebase auth errors
# Solution: Verify Firebase config
```

### **Debugging Commands**
```bash
# Check Python environment
python --version
which python
pip list

# Check Node.js environment
node --version
npm --version
npm list

# Check running processes
lsof -i :8000  # Backend port
lsof -i :8081  # Expo port
```

## 🔥 Firebase Setup Tips

### **Firebase Console Setup**
1. **Enable Authentication**:
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Configure authorized domains

2. **Get Service Account Key**:
   - Go to Project Settings > Service Accounts
   - Generate new private key
   - Save as `service-account-key.json`

3. **Set Environment Variables**:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="path/to/service-account-key.json"
   ```

### **Firebase Config Updates**
```javascript
// Update firebase.js with your config
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  // ... rest of config
};
```

## 📱 React Native Development Tips

### **Expo Go App**
- **iOS**: Use Camera app to scan QR code
- **Android**: Use Expo Go app
- **Web**: Press `w` in terminal
- **Simulator**: Press `i` for iOS, `a` for Android

### **Hot Reloading**
- **Automatic**: Changes reflect immediately
- **Manual**: Press `r` in terminal to reload
- **Clear cache**: `npx expo start --clear`

### **Navigation Debugging**
- **React Navigation**: Check navigation state
- **Auth flow**: Verify user authentication state
- **Screen params**: Check for serialization issues

## 🐍 Python Backend Tips

### **FastAPI Development**
```bash
# Run with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Run production mode
python main.py

# Check API documentation
open http://localhost:8000/docs
```

### **Environment Variables**
```bash
# Set Firebase credentials
export GOOGLE_APPLICATION_CREDENTIALS="path/to/service-account-key.json"

# Check environment
echo $GOOGLE_APPLICATION_CREDENTIALS
```

### **Package Management**
```bash
# Install new package
pip install package-name

# Update requirements
pip freeze > requirements.txt

# Install from requirements
pip install -r requirements.txt
```

## 🚀 Deployment Tips

### **Local Development**
- **React Native**: Expo Go app
- **Backend**: http://localhost:8000
- **Database**: Firebase (cloud)

### **Production Deployment**
- **React Native**: Build for app stores
- **Backend**: Deploy to Railway, Heroku, or AWS
- **Database**: Firebase (same as development)

### **Railway Deployment**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy backend
cd backend
railway deploy
```

## 📊 Monitoring & Logs

### **React Native Logs**
```bash
# View Expo logs
npx expo start --verbose

# Check Metro bundler
npx expo start --clear
```

### **Backend Logs**
```bash
# Run with verbose logging
python main.py --log-level debug

# Check API health
curl http://localhost:8000/health
```

### **Firebase Logs**
- **Authentication**: Firebase Console > Authentication > Users
- **API calls**: Firebase Console > Functions > Logs
- **Errors**: Check browser console and terminal

## 🔧 Useful Commands

### **Project Management**
```bash
# Start everything
npm start                    # React Native
cd backend && python main.py # Backend

# Check status
curl http://localhost:8000/health
lsof -i :8000
lsof -i :8081

# Clean up
npm run clean
pip cache purge
```

### **Development Shortcuts**
```bash
# Quick backend restart
cd backend && python main.py

# Quick React Native reload
# Press 'r' in Expo terminal

# Check environment
pyenv version
node --version
```

## 🎯 Best Practices

### **Code Organization**
- **Frontend**: Keep screens in `screens/` directory
- **Backend**: Keep API logic in `main.py`
- **Shared**: Use `services/` for API calls
- **Config**: Keep secrets in environment variables

### **Version Control**
- **Python**: Use `requirements.txt` for dependencies
- **Node.js**: Use `package.json` for dependencies
- **Environment**: Use `.env` files for secrets
- **Git**: Add `.env` to `.gitignore`

### **Testing**
- **Frontend**: Test in Expo Go app
- **Backend**: Test with curl or Postman
- **Integration**: Test full authentication flow
- **API**: Use FastAPI's built-in docs

## 🆘 Emergency Fixes

### **Reset Everything**
```bash
# Reset Python environment
pyenv deactivate
pyenv local health-planner
cd backend && pip install -r requirements.txt

# Reset React Native
npm install
npx expo start --clear

# Reset Firebase
# Check Firebase Console settings
```

### **Common Fixes**
```bash
# Port conflicts
lsof -ti:8000 | xargs kill -9  # Kill backend
lsof -ti:8081 | xargs kill -9  # Kill Expo

# Cache issues
npm cache clean --force
pip cache purge

# Environment issues
pyenv rehash
npm install
```

## 📞 Getting Help

### **Documentation**
- **Project**: `README.md`, `SETUP.md`
- **Backend**: `backend/README.md`
- **API**: http://localhost:8000/docs

### **Debugging Steps**
1. **Check environment**: `pyenv version`, `node --version`
2. **Check services**: `curl http://localhost:8000/health`
3. **Check logs**: Terminal output, browser console
4. **Check config**: Firebase settings, API URLs

### **Useful Resources**
- **Expo**: https://docs.expo.dev/
- **FastAPI**: https://fastapi.tiangolo.com/
- **Firebase**: https://firebase.google.com/docs
- **React Navigation**: https://reactnavigation.org/

---

**Remember**: This project uses two separate environments (Python + Node.js) that work together but are completely independent. Keep them separate and you'll avoid conflicts!
