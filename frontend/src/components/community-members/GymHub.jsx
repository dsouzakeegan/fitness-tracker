import React, { useState, useMemo } from 'react';
import {
  Users, Trophy, MessageCircle, Heart, Share2, TrendingUp,
  Medal, Flame, Target, Calendar, MapPin, Clock,
  ThumbsUp, Award, Star, Crown, Zap, Activity
} from 'lucide-react';

const GymHub = () => {
  const [activeTab, setActiveTab] = useState('members');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock data - replace with actual data
  const membersData = {
    totalMembers: 2847,
    activeToday: 324,
    newThisWeek: 89,
    topMembers: [
      {
        id: 1,
        name: 'Alex Rodriguez',
        avatar: '🏋️‍♂️',
        level: 25,
        streak: 89,
        totalWorkouts: 456,
        achievements: 34,
        location: 'New York, NY',
        joinDate: '2023-01-15',
        status: 'online',
        bio: 'Powerlifter passionate about strength training',
        specialties: ['Powerlifting', 'Strength Training'],
        followers: 234,
        following: 187
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        avatar: '🏃‍♀️',
        level: 22,
        streak: 67,
        totalWorkouts: 378,
        achievements: 28,
        location: 'Los Angeles, CA',
        joinDate: '2023-03-22',
        status: 'online',
        bio: 'Marathon runner and yoga enthusiast',
        specialties: ['Cardio', 'Yoga', 'Endurance'],
        followers: 189,
        following: 156
      },
      {
        id: 3,
        name: 'Mike Chen',
        avatar: '💪',
        level: 28,
        streak: 124,
        totalWorkouts: 612,
        achievements: 41,
        location: 'San Francisco, CA',
        joinDate: '2022-11-08',
        status: 'away',
        bio: 'CrossFit coach and nutrition expert',
        specialties: ['CrossFit', 'Nutrition', 'HIIT'],
        followers: 312,
        following: 198
      },
      {
        id: 4,
        name: 'Emma Wilson',
        avatar: '🧘‍♀️',
        level: 19,
        streak: 45,
        totalWorkouts: 289,
        achievements: 22,
        location: 'Chicago, IL',
        joinDate: '2023-05-12',
        status: 'online',
        bio: 'Mindful movement and flexibility coach',
        specialties: ['Yoga', 'Pilates', 'Flexibility'],
        followers: 167,
        following: 134
      },
      {
        id: 5,
        name: 'David Park',
        avatar: '🚴‍♂️',
        level: 21,
        streak: 56,
        totalWorkouts: 334,
        achievements: 26,
        location: 'Austin, TX',
        joinDate: '2023-02-28',
        status: 'online',
        bio: 'Cycling enthusiast and outdoor adventurer',
        specialties: ['Cycling', 'Outdoor Training'],
        followers: 145,
        following: 112
      },
      {
        id: 6,
        name: 'Lisa Martinez',
        avatar: '🏊‍♀️',
        level: 24,
        streak: 78,
        totalWorkouts: 445,
        achievements: 31,
        location: 'Miami, FL',
        joinDate: '2022-12-15',
        status: 'away',
        bio: 'Triathlete and swimming coach',
        specialties: ['Swimming', 'Triathlon', 'Cardio'],
        followers: 201,
        following: 167
      }
    ],
    leaderboard: [
      { rank: 1, name: 'Mike Chen', workouts: 15, calories: 2340 },
      { rank: 2, name: 'Alex Rodriguez', workouts: 14, calories: 2180 },
      { rank: 3, name: 'Lisa Martinez', workouts: 13, calories: 1950 },
      { rank: 4, name: 'Sarah Johnson', workouts: 12, calories: 1840 },
      { rank: 5, name: 'Emma Wilson', workouts: 11, calories: 1720 }
    ],
    recentActivity: [
      {
        id: 1,
        user: 'Alex Rodriguez',
        avatar: '🏋️‍♂️',
        action: 'completed a Beast Mode workout',
        time: '2 min ago',
        likes: 12,
        comments: 3
      },
      {
        id: 2,
        user: 'Sarah Johnson',
        avatar: '🏃‍♀️',
        action: 'achieved a new PR in 5K run',
        time: '15 min ago',
        likes: 28,
        comments: 7
      },
      {
        id: 3,
        user: 'Mike Chen',
        avatar: '💪',
        action: 'reached 100-day streak milestone',
        time: '1 hour ago',
        likes: 45,
        comments: 12
      }
    ]
  };

  const tabs = [
    { key: 'members', label: 'Members', icon: Users },
    { key: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { key: 'activity', label: 'Activity', icon: Activity },
    { key: 'challenges', label: 'Challenges', icon: Target }
  ];

  const filters = [
    { key: 'all', label: 'All Members' },
    { key: 'online', label: 'Online Now' },
    { key: 'top', label: 'Top Performers' },
    { key: 'new', label: 'New Members' }
  ];

  const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }) => (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all">
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
      <div className="text-white text-3xl font-bold mb-1">{value.toLocaleString()}</div>
      <div className="text-slate-400 text-sm">{title}</div>
      {subtitle && <div className="text-slate-500 text-xs mt-1">{subtitle}</div>}
    </div>
  );

  const MemberCard = ({ member, isCompact = false }) => {
    const getStatusColor = (status) => {
      switch(status) {
        case 'online': return '#10b981';
        case 'away': return '#f59e0b';
        case 'offline': return '#6b7280';
        default: return '#6b7280';
      }
    };

    if (isCompact) {
      return (
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-slate-600 transition-all group">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-2xl">
                {member.avatar}
              </div>
              <div 
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-800"
                style={{ backgroundColor: getStatusColor(member.status) }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-semibold truncate">{member.name}</h4>
              <p className="text-slate-400 text-sm">{member.specialties?.[0] || 'Fitness Enthusiast'}</p>
            </div>
            <div className="text-right">
              <div className="text-orange-400 font-bold">L{member.level}</div>
              <div className="text-slate-400 text-xs">{member.totalWorkouts} workouts</div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all group">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-3xl">
                {member.avatar}
              </div>
              <div 
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-800"
                style={{ backgroundColor: getStatusColor(member.status) }}
              />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{member.name}</h3>
              <div className="flex items-center space-x-2 text-slate-400 text-sm">
                <MapPin size={14} />
                <span>{member.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-400 text-sm mt-1">
                <Calendar size={14} />
                <span>Joined {new Date(member.joinDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
              <MessageCircle size={18} className="text-slate-300" />
            </button>
            <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
              <Heart size={18} className="text-slate-300" />
            </button>
          </div>
        </div>

        {/* Bio */}
        <p className="text-slate-300 text-sm mb-4">{member.bio}</p>

        {/* Specialties */}
        <div className="flex flex-wrap gap-2 mb-4">
          {member.specialties.map((specialty, index) => (
            <span 
              key={index} 
              className="px-3 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full font-medium"
            >
              {specialty}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-white font-bold">L{member.level}</div>
            <div className="text-slate-400 text-xs">Level</div>
          </div>
          <div className="text-center">
            <div className="text-orange-400 font-bold">{member.streak}</div>
            <div className="text-slate-400 text-xs">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-green-400 font-bold">{member.totalWorkouts}</div>
            <div className="text-slate-400 text-xs">Workouts</div>
          </div>
          <div className="text-center">
            <div className="text-purple-400 font-bold">{member.achievements}</div>
            <div className="text-slate-400 text-xs">Achievements</div>
          </div>
        </div>

        {/* Social Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700">
          <div className="flex items-center space-x-4 text-sm text-slate-400">
            <span>{member.followers} followers</span>
            <span>{member.following} following</span>
          </div>
          <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors">
            Follow
          </button>
        </div>
      </div>
    );
  };

  const LeaderboardCard = ({ member, rank }) => {
    const getRankColor = (rank) => {
      switch(rank) {
        case 1: return '#fbbf24'; // Gold
        case 2: return '#9ca3af'; // Silver
        case 3: return '#d97706'; // Bronze
        default: return '#6b7280';
      }
    };

    const getRankIcon = (rank) => {
      if (rank <= 3) return Crown;
      return Medal;
    };

    const Icon = getRankIcon(rank);

    return (
      <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl border border-slate-700 hover:border-slate-600 transition-all">
        <div className="flex items-center space-x-4">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
            style={{ 
              backgroundColor: `${getRankColor(rank)}20`,
              color: getRankColor(rank)
            }}
          >
            <Icon size={20} />
          </div>
          <div>
            <h4 className="text-white font-semibold">{member.name}</h4>
            <p className="text-slate-400 text-sm">Rank #{rank}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-orange-400 font-bold">{member.workouts} workouts</div>
          <div className="text-slate-400 text-sm">{member.calories.toLocaleString()} calories</div>
        </div>
      </div>
    );
  };

  const ActivityCard = ({ activity }) => (
    <div className="flex items-start space-x-4 p-4 bg-slate-800 rounded-xl border border-slate-700">
      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-xl">
        {activity.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white">
          <span className="font-semibold">{activity.user}</span>
          <span className="text-slate-300 ml-1">{activity.action}</span>
        </p>
        <div className="flex items-center space-x-4 mt-2 text-slate-400 text-sm">
          <div className="flex items-center space-x-1">
            <Clock size={14} />
            <span>{activity.time}</span>
          </div>
          <button className="flex items-center space-x-1 hover:text-red-400 transition-colors">
            <Heart size={14} />
            <span>{activity.likes}</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
            <MessageCircle size={14} />
            <span>{activity.comments}</span>
          </button>
        </div>
      </div>
    </div>
  );

  const ChallengeCard = ({ challenge }) => (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-white font-bold text-lg mb-2">{challenge.title}</h3>
          <p className="text-slate-400 text-sm mb-3">{challenge.description}</p>
          <div className="flex items-center space-x-4 text-sm text-slate-400">
            <div className="flex items-center space-x-1">
              <Users size={14} />
              <span>{challenge.participants} participants</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock size={14} />
              <span>{challenge.timeLeft}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-orange-400 font-bold text-2xl">{challenge.reward}</div>
          <div className="text-slate-400 text-sm">reward</div>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-400">Progress</span>
          <span className="text-white">{challenge.progress}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all"
            style={{ width: `${challenge.progress}%` }}
          />
        </div>
      </div>
      <button className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors">
        Join Challenge
      </button>
    </div>
  );

  const challenges = [
    {
      title: '30-Day Consistency Challenge',
      description: 'Complete a workout every day for 30 days',
      participants: 89,
      timeLeft: '12 days left',
      progress: 60,
      reward: '500 XP'
    },
    {
      title: 'Summer Shred Challenge',
      description: 'Burn 10,000 calories this month',
      participants: 156,
      timeLeft: '18 days left',
      progress: 45,
      reward: '1000 XP'
    },
    {
      title: 'Strength Builder',
      description: 'Increase your total 1RM by 10%',
      participants: 67,
      timeLeft: '25 days left',
      progress: 30,
      reward: '750 XP'
    }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'members':
        const filteredMembers = selectedFilter === 'online' 
          ? membersData.topMembers.filter(m => m.status === 'online')
          : selectedFilter === 'top'
          ? membersData.topMembers.slice(0, 3)
          : selectedFilter === 'new'
          ? membersData.topMembers.slice(-3)
          : membersData.topMembers;

        return (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setSelectedFilter(filter.key)}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    selectedFilter === filter.key
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredMembers.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        );

      case 'leaderboard':
        return (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-white text-lg font-semibold mb-6 flex items-center">
                <div className="w-2 h-2 rounded-full bg-orange-500 mr-3"></div>
                Weekly Leaderboard
              </h3>
              <div className="space-y-4">
                {membersData.leaderboard.map((member, index) => (
                  <LeaderboardCard key={member.name} member={member} rank={index + 1} />
                ))}
              </div>
            </div>
          </div>
        );

      case 'activity':
        return (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-white text-lg font-semibold mb-6 flex items-center">
                <div className="w-2 h-2 rounded-full bg-orange-500 mr-3"></div>
                Recent Activity
              </h3>
              <div className="space-y-4">
                {membersData.recentActivity.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          </div>
        );

      case 'challenges':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge, index) => (
                <ChallengeCard key={index} challenge={challenge} />
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-900 h-full overflow-y-auto flex-1" style={{ height: 'calc(100vh - 64px)' }}>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Users size={24} className="text-white" />
            </div>
            <h1 className="text-white text-3xl font-bold">Community Hub</h1>
          </div>
        </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Members"
          value={membersData.totalMembers}
          subtitle="Growing strong"
          icon={Users}
          color="#3b82f6"
          trend={12}
        />
        <StatCard
          title="Active Today"
          value={membersData.activeToday}
          subtitle="Currently online"
          icon={Activity}
          color="#10b981"
        />
        <StatCard
          title="New This Week"
          value={membersData.newThisWeek}
          subtitle="Welcome newcomers"
          icon={Star}
          color="#8b5cf6"
          trend={23}
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === key
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

export default GymHub;