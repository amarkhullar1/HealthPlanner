from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, auth
import os
from typing import Optional
import uvicorn
from firestore_service import firestore_service

# Initialize Firebase Admin SDK
# Check if we're running in Railway (production) or locally
if os.path.exists('/app/service-account-key.json'):
    # Railway production environment
    cred = credentials.Certificate('/app/service-account-key.json')
    firebase_admin.initialize_app(cred)
elif os.path.exists('service-account-key.json'):
    # Local development environment
    cred = credentials.Certificate('service-account-key.json')
    firebase_admin.initialize_app(cred)
else:
    # Fallback to default credentials (for local development without service account)
    try:
        firebase_admin.initialize_app()
    except ValueError:
        # If already initialized, continue
        pass

app = FastAPI(title="Health Planner API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your React Native app's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class TokenVerificationResponse(BaseModel):
    valid: bool
    uid: Optional[str] = None
    email: Optional[str] = None
    error: Optional[str] = None

class UserProfile(BaseModel):
    age: int
    gender: str
    height: float
    weight: float
    desired_weight: float
    end_date: str
    weight_loss: float
    current_bmi: float
    target_bmi: float

class HealthData(BaseModel):
    weight: float
    steps: int
    calories: int
    workout_completed: bool

class HealthDataResponse(BaseModel):
    success: bool
    message: str
    data: HealthData

# Token verification function
def verify_firebase_token(authorization: str = Header(None)) -> dict:
    """
    Verify Firebase ID token from Authorization header
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header format")
    
    try:
        token = authorization.split(" ")[1]
        decoded_token = auth.verify_id_token(token)
        
        return TokenVerificationResponse(
            valid=True,
            uid=decoded_token["uid"],
            email=decoded_token.get("email")
        )
    except Exception as e:
        return TokenVerificationResponse(
            valid=False,
            error=f"Token verification failed: {str(e)}"
        )

@app.get("/")
async def root():
    """
    Health check endpoint
    """
    return {"message": "Health Planner API is running!"}

@app.get("/health")
async def health_check():
    """
    Health check endpoint for Railway
    """
    return {"status": "healthy", "message": "Health Planner API is running!"}

@app.post("/health-data", response_model=HealthDataResponse)
async def save_health_data(
    health_data: HealthData,
    user_info: dict = Depends(verify_firebase_token)
):
    """
    Save health data for authenticated user
    """
    try:
        # In a real application, you would save this to a database
        # For now, we'll just return success
        return HealthDataResponse(
            success=True,
            message="Health data saved successfully",
            data=health_data
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save health data: {str(e)}")

@app.get("/health-data")
async def get_health_data(
    user_info: dict = Depends(verify_firebase_token)
):
    """
    Get health data for authenticated user
    """
    try:
        # In a real application, you would fetch from database
        # For now, return mock data
        return {
            "success": True,
            "data": [
                {
                    "date": "2024-01-01",
                    "weight": 70.5,
                    "steps": 8500,
                    "calories": 1800,
                    "workout_completed": True
                }
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch health data: {str(e)}")

@app.post("/user-profile")
async def save_user_profile(
    profile: UserProfile,
    user_info: dict = Depends(verify_firebase_token)
):
    """
    Save user profile data for authenticated user
    """
    try:
        # Save to Firestore
        result = firestore_service.save_user_profile(user_info['uid'], profile.dict())
        
        return {
            "success": True,
            "message": "User profile saved successfully",
            "data": profile.dict()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save user profile: {str(e)}")

@app.get("/user-profile")
async def get_user_profile(
    user_info: dict = Depends(verify_firebase_token)
):
    """
    Get user profile information
    """
    try:
        # Get from Firestore
        profile_data = firestore_service.get_user_profile(user_info['uid'])
        
        if profile_data and 'profile' in profile_data:
            return {
                "success": True,
                "user": {
                    "uid": user_info["uid"],
                    "email": user_info["email"]
                },
                "profile": profile_data['profile']
            }
        else:
            return {
                "success": False,
                "message": "No profile found for user"
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch user profile: {str(e)}")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)