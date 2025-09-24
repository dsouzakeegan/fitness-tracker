import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
  TrendingUp, Target, Calendar, Trophy, Zap, Heart,
  Scale, Ruler, Timer, Medal, Activity, Star,
  ChevronRight, Users, Flame, Award, RefreshCw, AlertCircle
} from 'lucide-react';
import {
  fetchProgressData,
  setSelectedTimeframe,
  setSelectedCategory,
  clearError,
  selectBodyMeasurements,
  selectStrengthProgress,
  selectFitnessMetrics,
  selectAchievements,
  selectProgressStatistics,
  selectProgressLoading,
  selectProgressError,
  selectSelectedTimeframe,
  selectSelectedCategory
} from '../../store/slices/progressSlice';

// Loading Fallback Component (similar to DashboardPanel)
const LoadingFallback = () => {
  const [loadingProgress, setLoadingProgress] = React.useState(0);
  const [loadingText, setLoadingText] = React.useState('Initializing progress tracker...');

  React.useEffect(() => {
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, 40);

    const textInterval = setInterval(() => {
      setLoadingText(prev => {
        const texts = [
          'Initializing progress tracker...',
          'Fetching progress data...',
          'Calculating analytics...',
          'Preparing visualizations...',
          'Almost ready...'
        ];
        const currentIndex = texts.indexOf(prev);
        return texts[(currentIndex + 1) % texts.length];
      });
    }, 400);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto mb-4">
            <div className="w-full h-full border-4 border-transparent border-t-orange-500 border-r-orange-500 rounded-full animate-spin"></div>
          </div>
        </div>

        <h2 className="text-white text-2xl font-bold mb-2">
          Loading Your Progress
        </h2>
        
        <p className="text-slate-400 mb-12 h-6 transition-all duration-300">
          {loadingText}
        </p>
      </div>
    </div>
  );
};

// Simulated delay hook for demonstration (same as DashboardPanel)
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

const ProgressTracker = () => {
  const dispatch = useDispatch();
  
  // Use individual selectors instead of the full progressData object
  const bodyMeasurements = useSelector(selectBodyMeasurements);
  const strengthProgress = useSelector(selectStrengthProgress);
  const fitnessMetrics = useSelector(selectFitnessMetrics);
  const achievements = useSelector(selectAchievements);
  const statistics = useSelector(selectProgressStatistics);
  const selectedTimeframe = useSelector(selectSelectedTimeframe);
  const selectedCategory = useSelector(selectSelectedCategory);
  const isLoading = useSelector(selectProgressLoading);
  const error = useSelector(selectProgressError);
  
  // Add simulated delay for demonstration
  const isSimulatedLoading = useSimulatedDelay(2000);

  // Local state for UI interactions
  const [refreshing, setRefreshing] = useState(false);

  // Categories configuration
  const categories = [
    { key: 'body', label: 'Body Composition', icon: Scale },
    { key: 'strength', label: 'Strength', icon: Trophy },
    { key: 'fitness', label: 'Fitness Metrics', icon: Activity },
    { key: 'achievements', label: 'Achievements', icon: Medal }
  ];

  // Fetch data on component mount and timeframe change
  useEffect(() => {
    dispatch(fetchProgressData(selectedTimeframe));
  }, [dispatch, selectedTimeframe]);

  // Handle timeframe change
  const handleTimeframeChange = async (timeframe) => {
    dispatch(setSelectedTimeframe(timeframe));
    setRefreshing(true);
    try {
      await dispatch(fetchProgressData(timeframe)).unwrap();
    } catch (err) {
      console.error('Failed to fetch progress data:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    dispatch(setSelectedCategory(category));
  };

  // Manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchProgressData(selectedTimeframe)).unwrap();
    } catch (err) {
      console.error('Failed to refresh progress data:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // Clear errors
  const handleClearError = () => {
    dispatch(clearError());
  };

  // Calculate percentage change for metrics
  const calculatePercentageChange = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  // Get latest measurement values with change
  const getLatestMeasurementData = () => {
    const weight = bodyMeasurements?.weight || [];
    const bodyFat = bodyMeasurements?.bodyFat || [];
    const muscle = bodyMeasurements?.muscle || [];

    const latestWeight = weight.length > 0 ? weight[weight.length - 1] : { value: 0 };
    const prevWeight = weight.length > 1 ? weight[weight.length - 2] : { value: 0 };
    
    const latestBodyFat = bodyFat.length > 0 ? bodyFat[bodyFat.length - 1] : { value: 0 };
    const prevBodyFat = bodyFat.length > 1 ? bodyFat[bodyFat.length - 2] : { value: 0 };
    
    const latestMuscle = muscle.length > 0 ? muscle[muscle.length - 1] : { value: 0 };
    const prevMuscle = muscle.length > 1 ? muscle[muscle.length - 2] : { value: 0 };

    return {
      weight: {
        value: latestWeight.value,
        change: calculatePercentageChange(latestWeight.value, prevWeight.value)
      },
      bodyFat: {
        value: latestBodyFat.value,
        change: calculatePercentageChange(latestBodyFat.value, prevBodyFat.value)
      },
      muscle: {
        value: latestMuscle.value,
        change: calculatePercentageChange(latestMuscle.value, prevMuscle.value)
      }
    };
  };

  const latestData = useMemo(() => getLatestMeasurementData(), [bodyMeasurements]);

  // Show loading while simulated delay is active or Redux loading
  if (isSimulatedLoading || isLoading) {
    return <LoadingFallback />;
  }

  const MetricCard = ({ title, value, unit, change, trend, icon: Icon, color, loading = false }) => (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center`} style={{ backgroundColor: `${color}20` }}>
            <Icon size={24} style={{ color }} />
          </div>
          <div>
            <h3 className="text-white font-semibold">{title}</h3>
            <p className="text-slate-400 text-sm">{unit}</p>
          </div>
        </div>
        {trend && !loading && (
          <div className={`flex items-center text-sm font-medium ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            <TrendingUp size={16} className={`mr-1 ${change < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(change)}%
          </div>
        )}
      </div>
      
      <div className="flex items-end justify-between">
        <div className="text-3xl font-bold text-white">
          {loading ? (
            <div className="animate-pulse bg-slate-600 h-8 w-16 rounded"></div>
          ) : (
            value
          )}
        </div>
        {change !== undefined && !loading && (
          <div className={`text-sm px-2 py-1 rounded-lg ${
            change >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {change >= 0 ? '+' : ''}{change}%
          </div>
        )}
      </div>
    </div>
  );

  const StrengthCard = ({ exercise, data, unit = 'lbs' }) => (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold capitalize">{exercise}</h3>
        <div className="text-orange-400 font-bold">{data.current}{unit}</div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Current</span>
          <span className="text-white">{data.current}{unit}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Personal Best</span>
          <span className="text-green-400">{data.best}{unit}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Goal</span>
          <span className="text-blue-400">{data.goal}{unit}</span>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Progress to Goal</span>
            <span>{data.progress}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${data.progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const AchievementCard = ({ achievement }) => {
    const getTypeColor = (type) => {
      switch(type) {
        case 'milestone': return '#f59e0b';
        case 'consistency': return '#10b981';
        case 'body': return '#8b5cf6';
        case 'volume': return '#ef4444';
        default: return '#6b7280';
      }
    };

    const getTypeIcon = (type) => {
      switch(type) {
        case 'milestone': return Trophy;
        case 'consistency': return Target;
        case 'body': return Scale;
        case 'volume': return Activity;
        default: return Star;
      }
    };

    const Icon = getTypeIcon(achievement.type);

    return (
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-slate-600 transition-all">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${getTypeColor(achievement.type)}20` }}
          >
            <Icon size={20} style={{ color: getTypeColor(achievement.type) }} />
          </div>
          <div className="flex-1">
            <h4 className="text-white font-medium">{achievement.title}</h4>
            <p className="text-slate-400 text-sm">{new Date(achievement.date).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    );
  };

  // Error Display Component
  const ErrorDisplay = ({ error, onClear }) => (
    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <AlertCircle className="text-red-400 mt-0.5" size={20} />
        <div className="flex-1">
          <h3 className="text-red-400 font-medium">Error Loading Progress Data</h3>
          <p className="text-red-300 text-sm mt-1">
            {error?.message || 'Failed to load progress data. Please try again.'}
          </p>
          <button
            onClick={onClear}
            className="mt-3 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1 rounded transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );

  // Loading Skeleton Component
  const LoadingSkeleton = ({ className }) => (
    <div className={`animate-pulse bg-slate-700 rounded ${className}`}></div>
  );

  const renderBodyComposition = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Weight"
          value={latestData.weight.value ? `${latestData.weight.value}` : '0'}
          unit="lbs"
          change={latestData.weight.change}
          trend={true}
          icon={Scale}
          color="#ef4444"
          loading={isLoading}
        />
        <MetricCard
          title="Body Fat"
          value={latestData.bodyFat.value ? `${latestData.bodyFat.value}%` : '0%'}
          unit="percentage"
          change={latestData.bodyFat.change}
          trend={true}
          icon={Target}
          color="#8b5cf6"
          loading={isLoading}
        />
        <MetricCard
          title="Muscle Mass"
          value={latestData.muscle.value ? `${latestData.muscle.value}` : '0'}
          unit="lbs"
          change={latestData.muscle.change}
          trend={true}
          icon={Zap}
          color="#10b981"
          loading={isLoading}
        />
      </div>

      {/* Weight Progress Chart */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <h3 className="text-white text-lg font-semibold mb-6 flex items-center">
          <div className="w-2 h-2 rounded-full bg-orange-500 mr-3"></div>
          Weight Progress
        </h3>
        {isLoading ? (
          <LoadingSkeleton className="h-80 w-full" />
        ) : bodyMeasurements.weight.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={bodyMeasurements.weight}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
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
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#ef4444" 
                fill="#ef4444"
                fillOpacity={0.2}
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-80 text-slate-400">
            <div className="text-center">
              <Scale size={48} className="mx-auto mb-4 opacity-50" />
              <p>No weight data available</p>
            </div>
          </div>
        )}
      </div>

      {/* Body Composition Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-white text-lg font-semibold mb-6 flex items-center">
            <div className="w-2 h-2 rounded-full bg-purple-500 mr-3"></div>
            Body Fat Trend
          </h3>
          {isLoading ? (
            <LoadingSkeleton className="h-48 w-full" />
          ) : bodyMeasurements.bodyFat.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={bodyMeasurements.bodyFat}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-400">
              <div className="text-center">
                <Target size={32} className="mx-auto mb-2 opacity-50" />
                <p>No body fat data available</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-white text-lg font-semibold mb-6 flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
            Muscle Mass Trend
          </h3>
          {isLoading ? (
            <LoadingSkeleton className="h-48 w-full" />
          ) : bodyMeasurements.muscle.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={bodyMeasurements.muscle}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-400">
              <div className="text-center">
                <Zap size={32} className="mx-auto mb-2 opacity-50" />
                <p>No muscle mass data available</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStrength = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {Object.entries(strengthProgress).map(([exercise, data]) => (
          <StrengthCard key={exercise} exercise={exercise} data={data} />
        ))}
      </div>

      {/* Strength Comparison Chart */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <h3 className="text-white text-lg font-semibold mb-6 flex items-center">
          <div className="w-2 h-2 rounded-full bg-orange-500 mr-3"></div>
          Strength Progress Overview
        </h3>
        {isLoading ? (
          <LoadingSkeleton className="h-80 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={Object.entries(strengthProgress).map(([exercise, data]) => ({
              exercise: exercise.toUpperCase(),
              current: data.current,
              goal: data.goal,
              best: data.best
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="exercise" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af' }}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="current" fill="#f97316" radius={[4, 4, 0, 0]} />
              <Bar dataKey="best" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="goal" fill="#3b82f6" radius={[4, 4, 0, 0]} opacity={0.3} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );

  const renderFitnessMetrics = () => (
    <div className="space-y-6">
      {/* Fitness Radar Chart */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <h3 className="text-white text-lg font-semibold mb-6 flex items-center">
          <div className="w-2 h-2 rounded-full bg-orange-500 mr-3"></div>
          Overall Fitness Assessment
        </h3>
        {isLoading ? (
          <LoadingSkeleton className="h-96 w-full" />
        ) : fitnessMetrics.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={fitnessMetrics}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                axisLine={false}
                tick={{ fill: '#9ca3af', fontSize: 10 }}
              />
              <Radar
                name="Current"
                dataKey="current"
                stroke="#f97316"
                fill="#f97316"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Radar
                name="Goal"
                dataKey="goal"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.1}
                strokeWidth={2}
                strokeDasharray="5 5"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-96 text-slate-400">
            <div className="text-center">
              <Activity size={48} className="mx-auto mb-4 opacity-50" />
              <p>No fitness metrics available</p>
            </div>
          </div>
        )}
      </div>

      {/* Individual Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, index) => (
            <div key={index} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <LoadingSkeleton className="h-24 w-full" />
            </div>
          ))
        ) : fitnessMetrics.length > 0 ? (
          fitnessMetrics.map((metric) => (
            <div key={metric.metric} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-semibold">{metric.metric}</h4>
                <span className="text-orange-400 font-bold">{metric.current}/100</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 mb-3">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${metric.current}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-slate-400">
                <span>Current: {metric.current}</span>
                <span>Goal: {metric.goal}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center h-48 text-slate-400">
            <div className="text-center">
              <Activity size={48} className="mx-auto mb-4 opacity-50" />
              <p>No fitness metrics available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      {/* Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Achievements"
          value={statistics.totalAchievements}
          unit="unlocked"
          icon={Trophy}
          color="#f59e0b"
          loading={isLoading}
        />
        <MetricCard
          title="This Month"
          value={statistics.thisMonthAchievements}
          unit="new achievements"
          change={statistics.thisMonthAchievements > 0 ? 50 : 0}
          trend={true}
          icon={Medal}
          color="#10b981"
          loading={isLoading}
        />
        <MetricCard
          title="Streak Record"
          value={statistics.streakRecord}
          unit="days"
          icon={Flame}
          color="#ef4444"
          loading={isLoading}
        />
        <MetricCard
          title="Level"
          value={statistics.level}
          unit="fitness level"
          icon={Star}
          color="#8b5cf6"
          loading={isLoading}
        />
      </div>

      {/* Recent Achievements */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <h3 className="text-white text-lg font-semibold mb-6 flex items-center">
          <div className="w-2 h-2 rounded-full bg-orange-500 mr-3"></div>
          Recent Achievements
        </h3>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array(4).fill(0).map((_, index) => (
              <LoadingSkeleton key={index} className="h-20 w-full" />
            ))}
          </div>
        ) : achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.slice(0, 6).map((achievement, index) => (
              <AchievementCard key={index} achievement={achievement} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 text-slate-400">
            <div className="text-center">
              <Trophy size={48} className="mx-auto mb-4 opacity-50" />
              <p>No achievements yet</p>
              <p className="text-sm mt-2">Keep working out to unlock achievements!</p>
            </div>
          </div>
        )}
      </div>

      {/* Achievement Categories */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <h3 className="text-white text-lg font-semibold mb-6 flex items-center">
          <div className="w-2 h-2 rounded-full bg-orange-500 mr-3"></div>
          Achievement Categories
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { type: 'milestone', icon: Trophy, color: 'amber-500', label: 'Milestones', count: achievements.filter(a => a.type === 'milestone').length },
            { type: 'consistency', icon: Target, color: 'green-500', label: 'Consistency', count: achievements.filter(a => a.type === 'consistency').length },
            { type: 'body', icon: Scale, color: 'purple-500', label: 'Body Goals', count: achievements.filter(a => a.type === 'body').length },
            { type: 'volume', icon: Activity, color: 'red-500', label: 'Volume', count: achievements.filter(a => a.type === 'volume').length }
          ].map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.type} className="text-center">
                <div className={`w-16 h-16 bg-${category.color}/20 rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                  <Icon size={32} className={`text-${category.color}`} />
                </div>
                <h4 className="text-white font-semibold">{category.label}</h4>
                <p className="text-slate-400 text-sm">
                  {isLoading ? (
                    <LoadingSkeleton className="h-4 w-16 mx-auto" />
                  ) : (
                    `${category.count} unlocked`
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(selectedCategory) {
      case 'body': return renderBodyComposition();
      case 'strength': return renderStrength();
      case 'fitness': return renderFitnessMetrics();
      case 'achievements': return renderAchievements();
      default: return renderBodyComposition();
    }
  };

  return (
    <div className="bg-slate-900 p-6 h-full overflow-y-auto" style={{ height: 'calc(100vh - 64px)' }}>
      <div className="max-w-[1600px] mx-auto">
        {/* Error Display */}
        {error && (
          <ErrorDisplay error={error} onClear={handleClearError} />
        )}

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-white" />
            </div>
            <h1 className="text-white text-3xl font-bold">Progress Tracker</h1>
            {(isLoading || refreshing) && (
              <RefreshCw className="text-orange-400 animate-spin" size={20} />
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isLoading || refreshing}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            </button>
            
            {/* Timeframe Buttons */}
            <div className="flex flex-wrap gap-2">
              {['1month', '3months', '6months', '1year'].map((period) => (
                <button
                  key={period}
                  onClick={() => handleTimeframeChange(period)}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors text-sm disabled:opacity-50 ${
                    selectedTimeframe === period
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {period === '1month' ? '1M' : period === '3months' ? '3M' : period === '6months' ? '6M' : '1Y'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => handleCategoryChange(key)}
              disabled={isLoading}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50 ${
                selectedCategory === key
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default ProgressTracker;