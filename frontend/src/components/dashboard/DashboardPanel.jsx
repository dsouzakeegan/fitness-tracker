import React, { Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingSpinner from '../shared-components/LoadingSpinner';
import { 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import {
  Calendar,
  Flame,
  Clock,
  Target,
  Zap,
  Heart,
  TrendingUp,
  Activity
} from 'lucide-react';

import { 
  fetchWorkoutAnalytics, 
  fetchWorkoutRecommendations,
  setSelectedPeriod 
} from '../../store/slices/workoutSlice';

// Loading Fallback Component
const LoadingFallback = () => {
  const [loadingProgress, setLoadingProgress] = React.useState(0);
  const [loadingText, setLoadingText] = React.useState('Initializing dashboard...');

  React.useEffect(() => {
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, 40); // Updates every 40ms for smooth animation

    const textInterval = setInterval(() => {
      setLoadingText(prev => {
        const texts = [
          'Initializing dashboard...',
          'Fetching workout data...',
          'Calculating analytics...',
          'Preparing visualizations...',
          'Almost ready...'
        ];
        const currentIndex = texts.indexOf(prev);
        return texts[(currentIndex + 1) % texts.length];
      });
    }, 400); // Change text every 400ms

    // Clean up intervals
    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto mb-4">
            {/* Rotating Ring */}
            <div className="w-full h-full border-4 border-transparent border-t-orange-500 border-r-orange-500 rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-white text-2xl font-bold mb-2">
          Loading Your Dashboard
        </h2>
        
        <p className="text-slate-400 mb-12 h-6 transition-all duration-300">
          {loadingText}
        </p>

        {/* Animated Dots */}
        {/* <div className="flex justify-center space-x-1 mt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div> */}
      </div>
    </div>
  );
};

// Simulated delay hook for demonstration
const useSimulatedDelay = (delay = 2000) => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return isLoading;
};

const StatCard = ({ title, value, suffix = '', icon: Icon, color, trend }) => (
  <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-colors">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center`} style={{ backgroundColor: `${color}20` }}>
        <Icon size={24} style={{ color }} />
      </div>
      {trend && (
        <div className="flex items-center text-green-400 text-sm font-medium">
          <TrendingUp size={16} className="mr-1" />
          +{trend}%
        </div>
      )}
    </div>
    <div className="text-slate-400 text-sm font-medium mb-2">{title}</div>
    <div className="text-white text-3xl font-bold">
      {value.toLocaleString()}
      <span className="text-lg text-slate-400 ml-1">{suffix}</span>
    </div>
  </div>
);

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  suffix: PropTypes.string,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired,
  trend: PropTypes.number
};

const ChartCard = ({ title, children, height = "h-80" }) => (
  <div className={`bg-slate-800 rounded-2xl p-6 border border-slate-700 ${height}`}>
    <h3 className="text-white text-lg font-semibold mb-6 flex items-center">
      <div className="w-2 h-2 rounded-full bg-orange-500 mr-3"></div>
      {title}
    </h3>
    {children}
  </div>
);

ChartCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  height: PropTypes.string
};

const DashboardContent = () => {
  const dispatch = useDispatch();
  const { 
    workoutAnalytics, 
    recommendations, 
    selectedPeriod, 
    status 
  } = useSelector((state) => state.workout);

  // Add simulated delay for demonstration
  const isSimulatedLoading = useSimulatedDelay(2000);

  const fetchWorkoutData = React.useCallback(() => {
    dispatch(fetchWorkoutAnalytics(selectedPeriod));
    dispatch(fetchWorkoutRecommendations());
  }, [dispatch, selectedPeriod]);

  React.useEffect(() => {
    fetchWorkoutData();
  }, [fetchWorkoutData]);

  const COLORS = ['#ff6b35', '#f7931e', '#8b5cf6', '#06b6d4', '#10b981'];

  // Show loading while simulated delay is active or Redux loading
  if (isSimulatedLoading || status === 'loading') {
    return <LoadingFallback />;
  }

  // Calculate metrics
  const calculateConsistency = () => {
    const totalWorkouts = workoutAnalytics?.totalWorkouts || 0;
    const expectedWorkouts = {
      'week': 3,
      'month': 12,
      'year': 144
    };
    
    const expected = expectedWorkouts[selectedPeriod] || expectedWorkouts['month'];
    return Math.min(Math.round((totalWorkouts / expected) * 100), 100);
  };

  const calculateAvgDuration = () => {
    if (workoutAnalytics?.progressTrends?.durationTrend?.length > 0) {
      const durations = workoutAnalytics.progressTrends.durationTrend;
      return Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);
    }
    return workoutAnalytics?.totalWorkouts > 0 ? 45 : 0;
  };

  // Prepare data for charts
  const workoutTypeData = workoutAnalytics?.workoutTypeBreakdown 
    ? Object.entries(workoutAnalytics.workoutTypeBreakdown).map(([name, value]) => ({ 
        name, 
        value,
        percentage: Math.round((value / workoutAnalytics.totalWorkouts) * 100) 
      }))
    : [];

  const intensityData = workoutAnalytics?.intensityDistribution
    ? Object.entries(workoutAnalytics.intensityDistribution).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="w-full h-full bg-slate-900 p-6 overflow-y-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Activity size={24} className="text-white" />
          </div>
          <h1 className="text-white text-3xl font-bold">Your Fitness Analytics</h1>
        </div>
        
        <div className="flex space-x-2">
          {['week', 'month', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => dispatch(setSelectedPeriod(period))}
              className={`px-6 py-2 rounded-xl font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Workouts"
          value={workoutAnalytics?.totalWorkouts || 0}
          icon={Calendar}
          color="#3b82f6"
          trend={15}
        />
        <StatCard
          title="Calories Burned"
          value={workoutAnalytics?.totalCaloriesBurned || 0}
          icon={Flame}
          color="#ef4444"
          trend={22}
        />
        <StatCard
          title="Avg Duration"
          value={calculateAvgDuration()}
          suffix="min"
          icon={Clock}
          color="#10b981"
        />
        <StatCard
          title="Consistency"
          value={calculateConsistency()}
          suffix="%"
          icon={Target}
          color={calculateConsistency() >= 70 ? '#10b981' : calculateConsistency() >= 40 ? '#f59e0b' : '#ef4444'}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Workout Type Distribution */}
        <ChartCard title="Workout Type Distribution">
          {workoutTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={workoutTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {workoutTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-500">
              No workout data available
            </div>
          )}
          
          {/* Legend */}
          <div className="flex justify-center space-x-6 mt-4">
            {workoutTypeData.map((entry, index) => (
              <div key={entry.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-slate-300 text-sm">
                  {entry.name} {entry.percentage}%
                </span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Workout Intensity */}
        <ChartCard title="Workout Intensity">
          {intensityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={intensityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Bar 
                  dataKey="value" 
                  fill="#f97316"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-500">
              No intensity data available
            </div>
          )}
        </ChartCard>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personalized Recommendations */}
        <div className="lg:col-span-2">
          <ChartCard title="Personalized Recommendations" height="h-64">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-40">
              <div className="bg-slate-700 rounded-xl p-4 flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-xl flex items-center justify-center">
                  <Target size={24} className="text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Suggested Workout Types</h4>
                  <p className="text-slate-400 text-sm">
                    {recommendations?.suggestedWorkoutTypes && recommendations.suggestedWorkoutTypes.length > 0 
                      ? recommendations.suggestedWorkoutTypes.join(', ')
                      : 'Keep up the great work with your current routine!'}
                  </p>
                </div>
              </div>
              
              <div className="bg-slate-700 rounded-xl p-4 flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-500 bg-opacity-20 rounded-xl flex items-center justify-center">
                  <Zap size={24} className="text-orange-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Intensity Guidance</h4>
                  <p className="text-slate-400 text-sm">
                    {recommendations?.intensityAdjustment || 'Your current intensity levels look good!'}
                  </p>
                </div>
              </div>
            </div>
          </ChartCard>
        </div>

        {/* Progress Insights */}
        <ChartCard title="Progress Insights" height="h-64">
          <div className="space-y-4 h-40">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Weekly Goal Progress</span>
              <span className="text-white font-semibold">87%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{ width: '87%' }}></div>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <span className="text-slate-400">Active Streak</span>
              <span className="text-white font-semibold flex items-center">
                <Heart size={16} className="text-red-400 mr-1" />
                {Math.min(workoutAnalytics?.totalWorkouts * 2 || 0, 30)} days
              </span>
            </div>
            
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-4 mt-4">
              <p className="text-white text-sm font-medium">
                Great job! You&apos;ve been consistent this month 🔥
              </p>
            </div>
          </div>
        </ChartCard>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

const DashboardPanel = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DashboardContent />
    </Suspense>
  );
};

export default DashboardPanel;