import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../firebase';

class FirestoreService {
  // User profile operations
  async saveUserProfile(userId, profileData) {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        profile: profileData,
        updatedAt: serverTimestamp()
      }, { merge: true });
      console.log('User profile saved successfully');
      return { success: true };
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  }

  async getUserProfile(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const docSnap = await getDoc(userRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  // Daily logs operations
  async saveDailyLog(userId, date, logData) {
    try {
      const logRef = doc(db, 'users', userId, 'dailyLogs', date);
      await setDoc(logRef, {
        ...logData,
        date,
        createdAt: serverTimestamp()
      });
      console.log('Daily log saved successfully');
      return { success: true };
    } catch (error) {
      console.error('Error saving daily log:', error);
      throw error;
    }
  }

  async getDailyLog(userId, date) {
    try {
      const logRef = doc(db, 'users', userId, 'dailyLogs', date);
      const docSnap = await getDoc(logRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error('Error getting daily log:', error);
      throw error;
    }
  }

  async getDailyLogs(userId, startDate, endDate) {
    try {
      const logsRef = collection(db, 'users', userId, 'dailyLogs');
      const q = query(
        logsRef,
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting daily logs:', error);
      throw error;
    }
  }

  // Goals operations
  async saveGoal(userId, goalData) {
    try {
      const goalsRef = collection(db, 'users', userId, 'goals');
      const docRef = await addDoc(goalsRef, {
        ...goalData,
        createdAt: serverTimestamp()
      });
      console.log('Goal saved successfully with ID:', docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error saving goal:', error);
      throw error;
    }
  }

  async getGoals(userId) {
    try {
      const goalsRef = collection(db, 'users', userId, 'goals');
      const q = query(goalsRef, where('status', '==', 'active'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting goals:', error);
      throw error;
    }
  }

  async updateGoal(userId, goalId, updateData) {
    try {
      const goalRef = doc(db, 'users', userId, 'goals', goalId);
      await updateDoc(goalRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      console.log('Goal updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  }

  // Workouts operations
  async saveWorkout(userId, workoutData) {
    try {
      const workoutsRef = collection(db, 'users', userId, 'workouts');
      const docRef = await addDoc(workoutsRef, {
        ...workoutData,
        createdAt: serverTimestamp()
      });
      console.log('Workout saved successfully with ID:', docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error saving workout:', error);
      throw error;
    }
  }

  async getWorkouts(userId, startDate, endDate) {
    try {
      const workoutsRef = collection(db, 'users', userId, 'workouts');
      const q = query(
        workoutsRef,
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting workouts:', error);
      throw error;
    }
  }

  // Progress tracking
  async getProgressData(userId, startDate, endDate) {
    try {
      const [dailyLogs, workouts] = await Promise.all([
        this.getDailyLogs(userId, startDate, endDate),
        this.getWorkouts(userId, startDate, endDate)
      ]);

      return {
        dailyLogs,
        workouts,
        summary: {
          totalDays: dailyLogs.length,
          workoutDays: workouts.length,
          averageSteps: dailyLogs.reduce((sum, log) => sum + (log.steps || 0), 0) / dailyLogs.length || 0,
          averageCalories: dailyLogs.reduce((sum, log) => sum + (log.calories || 0), 0) / dailyLogs.length || 0
        }
      };
    } catch (error) {
      console.error('Error getting progress data:', error);
      throw error;
    }
  }

  // Delete operations
  async deleteGoal(userId, goalId) {
    try {
      const goalRef = doc(db, 'users', userId, 'goals', goalId);
      await deleteDoc(goalRef);
      console.log('Goal deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  }

  async deleteWorkout(userId, workoutId) {
    try {
      const workoutRef = doc(db, 'users', userId, 'workouts', workoutId);
      await deleteDoc(workoutRef);
      console.log('Workout deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('Error deleting workout:', error);
      throw error;
    }
  }
}

export default new FirestoreService();
