import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
  Activity, Plus, Trash2
} from 'lucide-react';

import { 
  logWorkout
} from '../../store/slices/workoutSlice';

// Workout Logging Component
const WorkoutLogger = ({ onWorkoutLogged }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [workoutData, setWorkoutData] = useState({
    workoutType: 'Strength',
    duration: '',
    intensity: 'Medium',
    exercises: [{ name: '', sets: '', reps: '', weight: '' }],
    notes: ''
  });
  const [isLogging, setIsLogging] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLogging(true);

    try {
      // Filter out empty exercises
      const filteredExercises = workoutData.exercises.filter(ex => ex.name.trim());
      
      const workoutPayload = {
        ...workoutData,
        duration: parseInt(workoutData.duration),
        exercises: filteredExercises.map(ex => ({
          ...ex,
          sets: ex.sets ? parseInt(ex.sets) : 0,
          reps: ex.reps ? parseInt(ex.reps) : 0,
          weight: ex.weight ? parseFloat(ex.weight) : 0
        }))
      };

      // Dispatch logWorkout thunk with both workout data and navigation function
      await dispatch(logWorkout({ workoutData: workoutPayload, navigate })).unwrap();
      
      // Reset form
      setWorkoutData({
        workoutType: 'Strength',
        duration: '',
        intensity: 'Medium',
        exercises: [{ name: '', sets: '', reps: '', weight: '' }],
        notes: ''
      });

      onWorkoutLogged();
      
    } catch (error) {
      console.error('Failed to log workout:', error);
      alert('Failed to log workout. Please try again.');
    } finally {
      setIsLogging(false);
    }
  };

  const addExercise = () => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: [...prev.exercises, { name: '', sets: '', reps: '', weight: '' }]
    }));
  };

  const removeExercise = (index) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const updateExercise = (index, field, value) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) => 
        i === index ? { ...ex, [field]: value } : ex
      )
    }));
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-700">
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl mr-4">
          <Plus className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Log New Workout</h2>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Workout Type</label>
            <select 
              value={workoutData.workoutType}
              onChange={(e) => setWorkoutData(prev => ({ ...prev, workoutType: e.target.value }))}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            >
              <option value="Strength">💪 Strength</option>
              <option value="Cardio">❤️ Cardio</option>
              <option value="Flexibility">🧘 Flexibility</option>
              <option value="HIIT">⚡ HIIT</option>
              <option value="Other">🏃 Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Duration (minutes)</label>
            <input
              type="number"
              value={workoutData.duration}
              onChange={(e) => setWorkoutData(prev => ({ ...prev, duration: e.target.value }))}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="45"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Intensity</label>
            <select 
              value={workoutData.intensity}
              onChange={(e) => setWorkoutData(prev => ({ ...prev, intensity: e.target.value }))}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            >
              <option value="Low">🟢 Low</option>
              <option value="Medium">🟡 Medium</option>
              <option value="High">🟠 High</option>
              <option value="Extreme">🔴 Extreme</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">Exercises</label>
          <div className="space-y-3">
            {workoutData.exercises.map((exercise, index) => (
              <div key={index} className="bg-slate-800 p-4 rounded-xl border border-slate-600">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                  <input
                    placeholder="Exercise name"
                    value={exercise.name}
                    onChange={(e) => updateExercise(index, 'name', e.target.value)}
                    className="md:col-span-2 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                  <input
                    type="number"
                    placeholder="Sets"
                    value={exercise.sets}
                    onChange={(e) => updateExercise(index, 'sets', e.target.value)}
                    className="p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                  <input
                    type="number"
                    placeholder="Reps"
                    value={exercise.reps}
                    onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                    className="p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Weight (kg)"
                      value={exercise.weight}
                      onChange={(e) => updateExercise(index, 'weight', e.target.value)}
                      className="flex-1 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                    {workoutData.exercises.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExercise(index)}
                        className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addExercise}
            className="mt-3 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Exercise
          </button>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Notes</label>
          <textarea
            value={workoutData.notes}
            onChange={(e) => setWorkoutData(prev => ({ ...prev, notes: e.target.value }))}
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
            rows="3"
            placeholder="How did the workout feel? Any observations..."
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLogging}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none shadow-lg"
        >
          {isLogging ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Logging...
            </div>
          ) : (
            'Log Workout 🚀'
          )}
        </button>
      </div>
    </div>
  );
};

WorkoutLogger.propTypes = {
  onWorkoutLogged: PropTypes.func.isRequired
};

// Main Workout Tracking Component
const WorkoutTracking = () => {
  const { status } = useSelector((state) => state.workout);

  const handleWorkoutLogged = () => {
    // Placeholder for future implementation
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="animate-pulse h-8 w-8 text-white" />
          </div>
          <p className="text-white text-lg">Loading your workout data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      {/* Scrollable container with proper padding */}
      <div className="h-screen overflow-y-auto">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="space-y-8">
            <WorkoutLogger onWorkoutLogged={handleWorkoutLogged} />
            
            {/* Bottom spacing for better scroll experience */}
            <div className="h-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutTracking;