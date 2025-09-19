#!/usr/bin/env python3
"""
Setup script for Health Planner API
Run this script to install dependencies and start the server
"""

import subprocess
import sys
import os

def install_requirements():
    """Install Python dependencies"""
    print("Installing Python dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Requirements installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install requirements: {e}")
        return False
    return True

def setup_firebase():
    """Setup Firebase Admin SDK"""
    print("\nSetting up Firebase Admin SDK...")
    print("📝 Note: You'll need to set up Firebase credentials:")
    print("1. Go to Firebase Console (https://console.firebase.google.com/)")
    print("2. Select your project")
    print("3. Go to Project Settings > Service Accounts")
    print("4. Generate a new private key")
    print("5. Save the JSON file as 'service-account-key.json' in the backend directory")
    print("6. Set the GOOGLE_APPLICATION_CREDENTIALS environment variable")
    
    # Check if service account key exists
    if os.path.exists("service-account-key.json"):
        print("✅ Service account key found")
    else:
        print("⚠️  Service account key not found. Please follow the steps above.")

def start_server():
    """Start the FastAPI server"""
    print("\n🚀 Starting Health Planner API server...")
    print("Server will be available at: http://localhost:8000")
    print("API documentation at: http://localhost:8000/docs")
    print("\nPress Ctrl+C to stop the server")
    
    try:
        subprocess.run([sys.executable, "main.py"])
    except KeyboardInterrupt:
        print("\n👋 Server stopped")

def main():
    print("🏥 Health Planner API Setup")
    print("=" * 40)
    
    # Install requirements
    if not install_requirements():
        return
    
    # Setup Firebase
    setup_firebase()
    
    # Start server
    start_server()

if __name__ == "__main__":
    main()
