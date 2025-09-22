from firebase_admin import firestore
from datetime import datetime
from typing import Dict, List, Optional, Any
import logging
import os

logger = logging.getLogger(__name__)

class FirestoreService:
    def __init__(self):
        """Initialize Firestore service"""
        try:
            self.db = firestore.client()
        except Exception as e:
            logger.error(f"Failed to initialize Firestore client: {str(e)}")
            # For development, we'll create a mock client
            self.db = None
    
    def _check_db_connection(self):
        """Check if Firestore is properly initialized"""
        if self.db is None:
            raise Exception("Firestore client not initialized. Check Firebase configuration.")
    
    def save_user_profile(self, user_id: str, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """Save user profile to Firestore"""
        try:
            self._check_db_connection()
            user_ref = self.db.collection('users').document(user_id)
            user_ref.set({
                'profile': profile_data,
                'updatedAt': datetime.now()
            }, merge=True)
            logger.info(f"User profile saved for user {user_id}")
            return {"success": True, "message": "User profile saved successfully"}
        except Exception as e:
            logger.error(f"Error saving user profile: {str(e)}")
            raise Exception(f"Failed to save user profile: {str(e)}")
    
    def get_user_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user profile from Firestore"""
        try:
            self._check_db_connection()
            user_ref = self.db.collection('users').document(user_id)
            doc = user_ref.get()
            if doc.exists:
                return doc.to_dict()
            return None
        except Exception as e:
            logger.error(f"Error getting user profile: {str(e)}")
            raise Exception(f"Failed to get user profile: {str(e)}")
    
    def save_daily_log(self, user_id: str, date: str, log_data: Dict[str, Any]) -> Dict[str, Any]:
        """Save daily log to Firestore"""
        try:
            self._check_db_connection()
            log_ref = self.db.collection('users').document(user_id).collection('dailyLogs').document(date)
            log_ref.set({
                **log_data,
                'date': date,
                'createdAt': datetime.now()
            })
            logger.info(f"Daily log saved for user {user_id} on {date}")
            return {"success": True, "message": "Daily log saved successfully"}
        except Exception as e:
            logger.error(f"Error saving daily log: {str(e)}")
            raise Exception(f"Failed to save daily log: {str(e)}")
    
    def get_daily_log(self, user_id: str, date: str) -> Optional[Dict[str, Any]]:
        """Get daily log from Firestore"""
        try:
            self._check_db_connection()
            log_ref = self.db.collection('users').document(user_id).collection('dailyLogs').document(date)
            doc = log_ref.get()
            if doc.exists:
                return doc.to_dict()
            return None
        except Exception as e:
            logger.error(f"Error getting daily log: {str(e)}")
            raise Exception(f"Failed to get daily log: {str(e)}")
    
    def get_daily_logs(self, user_id: str, start_date: str, end_date: str) -> List[Dict[str, Any]]:
        """Get daily logs from Firestore within date range"""
        try:
            self._check_db_connection()
            logs_ref = self.db.collection('users').document(user_id).collection('dailyLogs')
            query = logs_ref.where('date', '>=', start_date).where('date', '<=', end_date).order_by('date', direction=firestore.Query.DESCENDING)
            docs = query.stream()
            return [{"id": doc.id, **doc.to_dict()} for doc in docs]
        except Exception as e:
            logger.error(f"Error getting daily logs: {str(e)}")
            raise Exception(f"Failed to get daily logs: {str(e)}")
    
    def save_goal(self, user_id: str, goal_data: Dict[str, Any]) -> Dict[str, Any]:
        """Save goal to Firestore"""
        try:
            self._check_db_connection()
            goals_ref = self.db.collection('users').document(user_id).collection('goals')
            doc_ref = goals_ref.add({
                **goal_data,
                'createdAt': datetime.now()
            })
            logger.info(f"Goal saved for user {user_id} with ID: {doc_ref[1].id}")
            return {"success": True, "message": "Goal saved successfully", "id": doc_ref[1].id}
        except Exception as e:
            logger.error(f"Error saving goal: {str(e)}")
            raise Exception(f"Failed to save goal: {str(e)}")
    
    def get_goals(self, user_id: str) -> List[Dict[str, Any]]:
        """Get active goals from Firestore"""
        try:
            self._check_db_connection()
            goals_ref = self.db.collection('users').document(user_id).collection('goals')
            query = goals_ref.where('status', '==', 'active')
            docs = query.stream()
            return [{"id": doc.id, **doc.to_dict()} for doc in docs]
        except Exception as e:
            logger.error(f"Error getting goals: {str(e)}")
            raise Exception(f"Failed to get goals: {str(e)}")
    
    def update_goal(self, user_id: str, goal_id: str, update_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update goal in Firestore"""
        try:
            self._check_db_connection()
            goal_ref = self.db.collection('users').document(user_id).collection('goals').document(goal_id)
            goal_ref.update({
                **update_data,
                'updatedAt': datetime.now()
            })
            logger.info(f"Goal updated for user {user_id}, goal {goal_id}")
            return {"success": True, "message": "Goal updated successfully"}
        except Exception as e:
            logger.error(f"Error updating goal: {str(e)}")
            raise Exception(f"Failed to update goal: {str(e)}")
    
    def save_workout(self, user_id: str, workout_data: Dict[str, Any]) -> Dict[str, Any]:
        """Save workout to Firestore"""
        try:
            self._check_db_connection()
            workouts_ref = self.db.collection('users').document(user_id).collection('workouts')
            doc_ref = workouts_ref.add({
                **workout_data,
                'createdAt': datetime.now()
            })
            logger.info(f"Workout saved for user {user_id} with ID: {doc_ref[1].id}")
            return {"success": True, "message": "Workout saved successfully", "id": doc_ref[1].id}
        except Exception as e:
            logger.error(f"Error saving workout: {str(e)}")
            raise Exception(f"Failed to save workout: {str(e)}")
    
    def get_workouts(self, user_id: str, start_date: str, end_date: str) -> List[Dict[str, Any]]:
        """Get workouts from Firestore within date range"""
        try:
            self._check_db_connection()
            workouts_ref = self.db.collection('users').document(user_id).collection('workouts')
            query = workouts_ref.where('date', '>=', start_date).where('date', '<=', end_date).order_by('date', direction=firestore.Query.DESCENDING)
            docs = query.stream()
            return [{"id": doc.id, **doc.to_dict()} for doc in docs]
        except Exception as e:
            logger.error(f"Error getting workouts: {str(e)}")
            raise Exception(f"Failed to get workouts: {str(e)}")
    
    def get_progress_data(self, user_id: str, start_date: str, end_date: str) -> Dict[str, Any]:
        """Get comprehensive progress data"""
        try:
            daily_logs = self.get_daily_logs(user_id, start_date, end_date)
            workouts = self.get_workouts(user_id, start_date, end_date)
            
            # Calculate summary statistics
            total_days = len(daily_logs)
            workout_days = len(workouts)
            average_steps = sum(log.get('steps', 0) for log in daily_logs) / total_days if total_days > 0 else 0
            average_calories = sum(log.get('calories', 0) for log in daily_logs) / total_days if total_days > 0 else 0
            
            return {
                "dailyLogs": daily_logs,
                "workouts": workouts,
                "summary": {
                    "totalDays": total_days,
                    "workoutDays": workout_days,
                    "averageSteps": round(average_steps, 2),
                    "averageCalories": round(average_calories, 2)
                }
            }
        except Exception as e:
            logger.error(f"Error getting progress data: {str(e)}")
            raise Exception(f"Failed to get progress data: {str(e)}")
    
    def delete_goal(self, user_id: str, goal_id: str) -> Dict[str, Any]:
        """Delete goal from Firestore"""
        try:
            self._check_db_connection()
            goal_ref = self.db.collection('users').document(user_id).collection('goals').document(goal_id)
            goal_ref.delete()
            logger.info(f"Goal deleted for user {user_id}, goal {goal_id}")
            return {"success": True, "message": "Goal deleted successfully"}
        except Exception as e:
            logger.error(f"Error deleting goal: {str(e)}")
            raise Exception(f"Failed to delete goal: {str(e)}")
    
    def delete_workout(self, user_id: str, workout_id: str) -> Dict[str, Any]:
        """Delete workout from Firestore"""
        try:
            self._check_db_connection()
            workout_ref = self.db.collection('users').document(user_id).collection('workouts').document(workout_id)
            workout_ref.delete()
            logger.info(f"Workout deleted for user {user_id}, workout {workout_id}")
            return {"success": True, "message": "Workout deleted successfully"}
        except Exception as e:
            logger.error(f"Error deleting workout: {str(e)}")
            raise Exception(f"Failed to delete workout: {str(e)}")

# Global instance
firestore_service = FirestoreService()