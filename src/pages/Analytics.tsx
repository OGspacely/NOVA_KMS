import React, { useEffect, useState } from 'react';
import api from '../api/axios.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { Play, Pause, Clock, CheckCircle2, Circle, ChevronDown, ChevronUp, MoreVertical, Users, AlertCircle, MessageSquare, Bell, TrendingUp, FileText, ShieldAlert } from 'lucide-react';

export const Analytics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('This Week');
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [activeTasks, setActiveTasks] = useState<number[]>([]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const toggleTask = (idx: number) => {
    setActiveTasks(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading analytics...</div>;

  // --- Role-Based Data Configuration ---

  const roleData = {
    Admin: {
      pillStats: [
        { label: 'Total Users', value: '1,204', color: 'bg-blue-600 text-white shadow-md' },
        { label: 'Active', value: '890', color: 'bg-indigo-100 text-indigo-700' },
        { label: 'Content', value: '456', color: 'bg-white text-black border border-gray-200' },
        { label: 'Uptime', value: '99.9%', color: 'bg-white text-black border border-gray-200' },
      ],
      largeStats: [
        { value: '12', label: 'Pending Review', icon: 'clock' },
        { value: '2.4h', label: 'Avg Review Time', icon: 'check' },
        { value: '3', label: 'Flagged Content', icon: 'alert' },
      ],
      profileBadge: 'System Admin',
      listItems: [
        { title: 'High Server Load Alert', type: 'alert' },
        { title: '5 New User Complaints', type: 'message' },
        { title: 'Outdated Materials (12)', type: 'notification' },
        { title: 'Duplicate Content (4)', type: 'notification' }
      ],
      progressTitle: 'Platform Usage',
      progressValue: '12.4k',
      progressSubtitle: `Sessions ${timeRange.toLowerCase()}`,
      trackerTitle: 'Approval Ratio',
      trackerTime: '92%',
      trackerSubtitle: 'Approved vs Rejected',
      barsTitle: 'Content by Subject',
      bars: [
        { label: 'Science', value: 40, color: 'bg-indigo-100 text-indigo-700' },
        { label: 'Math', value: 35, color: 'bg-blue-600 text-white' },
        { label: 'History', value: 25, color: 'bg-gray-300' },
      ],
      tasksTitle: 'Admin Actions',
      tasks: [
        { title: 'Review Article #402', time: 'Pending', done: false },
        { title: 'Approve User Batch', time: 'Pending', done: false },
        { title: 'Check System Logs', time: 'Completed', done: true },
        { title: 'Update Guidelines', time: 'Completed', done: true },
      ]
    },
    Teacher: {
      pillStats: [
        { label: 'Materials', value: '45', color: 'bg-blue-600 text-white shadow-md' },
        { label: 'Views', value: '1.2k', color: 'bg-indigo-100 text-indigo-700' },
        { label: 'Downloads', value: '340', color: 'bg-white text-black border border-gray-200' },
        { label: 'Pending', value: '3', color: 'bg-white text-black border border-gray-200' },
      ],
      largeStats: [
        { value: '120', label: 'Active Students', icon: 'users' },
        { value: '85%', label: 'Avg Score', icon: 'check' },
        { value: '92%', label: 'Engagement', icon: 'trending' },
      ],
      profileBadge: 'Top Educator',
      listItems: [
        { title: 'Reviewer Feedback (2)', type: 'notification' },
        { title: 'Student Q&A (15)', type: 'message' },
        { title: 'Low-performing: Math 101', type: 'alert' },
        { title: 'Content Gaps Identified', type: 'recommendation' }
      ],
      progressTitle: 'Student Engagement',
      progressValue: '85%',
      progressSubtitle: `Active participation ${timeRange.toLowerCase()}`,
      trackerTitle: 'Avg Student Score',
      trackerTime: '85%',
      trackerSubtitle: 'Across all subjects',
      barsTitle: 'Content Performance',
      bars: [
        { label: 'Most Viewed', value: 45, color: 'bg-indigo-100 text-indigo-700' },
        { label: 'Average', value: 35, color: 'bg-blue-600 text-white' },
        { label: 'Least Accessed', value: 20, color: 'bg-gray-300' },
      ],
      tasksTitle: 'Content Status',
      tasks: [
        { title: 'Physics 101 - Approved', time: 'Sep 13, 08:30', done: true },
        { title: 'Chemistry Lab - Pending', time: 'Sep 13, 10:30', done: false },
        { title: 'Math Quiz - Rejected', time: 'Sep 13, 13:00', done: false },
        { title: 'Biology Notes - Approved', time: 'Sep 13, 14:45', done: true },
      ]
    },
    Student: {
      pillStats: [
        { label: 'Study Time', value: '15h', color: 'bg-blue-600 text-white shadow-md' },
        { label: 'Quizzes', value: '80%', color: 'bg-indigo-100 text-indigo-700' },
        { label: 'Assignments', value: '100%', color: 'bg-white text-black border border-gray-200' },
        { label: 'Forum', value: '5', color: 'bg-white text-black border border-gray-200' },
      ],
      largeStats: [
        { value: '1,200', label: 'Points', icon: 'trending' },
        { value: '5', label: 'Streak', icon: 'check' },
        { value: '12', label: 'Rank', icon: 'users' },
      ],
      profileBadge: '1,200 pts',
      listItems: [
        { title: 'Enrolled Courses', type: 'notification' },
        { title: 'Recent Achievements', type: 'recommendation' },
        { title: 'Learning Path', type: 'notification' },
        { title: 'Saved Resources', type: 'notification' }
      ],
      progressTitle: 'Weekly Study',
      progressValue: '6.1h',
      progressSubtitle: `Study Time ${timeRange.toLowerCase()}`,
      trackerTitle: 'Daily Goal',
      trackerTime: '02:35',
      trackerSubtitle: 'Study Time',
      barsTitle: 'Course Progress',
      bars: [
        { label: 'Course 1', value: 40, color: 'bg-indigo-100 text-indigo-700' },
        { label: 'Course 2', value: 35, color: 'bg-blue-600 text-white' },
        { label: 'Course 3', value: 25, color: 'bg-gray-300' },
      ],
      tasksTitle: 'Student Tasks',
      tasks: [
        { title: 'Complete Quiz 1', time: 'Sep 13, 08:30', done: true },
        { title: 'Read Article Y', time: 'Sep 13, 10:30', done: true },
        { title: 'Submit Assignment Z', time: 'Sep 13, 13:00', done: false },
        { title: 'Participate in Forum', time: 'Sep 13, 14:45', done: false },
      ]
    }
  };

  const currentData = roleData[user?.role as keyof typeof roleData] || roleData.Student;

  // Mock chart data based on timeRange
  const chartData = timeRange === 'This Week' ? [
    { name: 'S', value: 20 },
    { name: 'M', value: 45 },
    { name: 'T', value: 30 },
    { name: 'W', value: 60 },
    { name: 'T', value: 25 },
    { name: 'F', value: 40 },
    { name: 'S', value: 15 },
  ] : [
    { name: 'W1', value: 120 },
    { name: 'W2', value: 145 },
    { name: 'W3', value: 130 },
    { name: 'W4', value: 160 },
  ];

  const getIconForStat = (iconType: string) => {
    switch (iconType) {
      case 'users': return <Users className="w-5 h-5" />;
      case 'check': return <CheckCircle2 className="w-5 h-5" />;
      case 'clock': return <Clock className="w-5 h-5" />;
      case 'alert': return <ShieldAlert className="w-5 h-5" />;
      case 'trending': return <TrendingUp className="w-5 h-5" />;
      default: return <Circle className="w-5 h-5" />;
    }
  };

  const getIconForListItem = (type: string) => {
    switch (type) {
      case 'alert': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'message': return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'recommendation': return <FileText className="w-4 h-4 text-green-500" />;
      default: return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-8 font-sans">
      <div className="max-w-[1400px] mx-auto bg-gradient-to-br from-[#FDFBF7] via-[#F9F5EB] to-[#F3EFE6] rounded-2xl sm:rounded-[40px] p-4 sm:p-6 lg:p-12 shadow-sm border border-white/50">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 sm:mb-12 gap-6 sm:gap-8">
          <div className="flex-1 w-full space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-light text-gray-900 flex flex-wrap items-center gap-2 sm:gap-4">
                <div>Welcome, <span className="font-semibold">{user?.name?.split(' ')[0] || 'User'}</span></div>
                <span className="inline-flex items-center px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm">
                  {user?.role || 'Student'} View
                </span>
              </h1>
              
              {/* Time Range Filter */}
              <div className="relative">
                <button 
                  onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                  className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-white transition-colors"
                >
                  {timeRange}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {isTimeDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    {['This Week', 'This Month'].map(range => (
                      <button
                        key={range}
                        onClick={() => { setTimeRange(range); setIsTimeDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${timeRange === range ? 'text-black font-medium' : 'text-gray-600'}`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Pill Stats */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 lg:gap-8">
              {currentData.pillStats.map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1 sm:gap-2 group cursor-pointer">
                  <span className="text-[10px] sm:text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">{stat.label}</span>
                  <div className={`px-3 sm:px-6 py-1 sm:py-2 rounded-full text-[10px] sm:text-sm font-medium transition-transform transform group-hover:scale-105 ${stat.color}`}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Large Stats */}
          <div className="flex flex-wrap sm:flex-nowrap gap-4 sm:gap-8 lg:gap-16 w-full lg:w-auto justify-between sm:justify-end">
            {currentData.largeStats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center group cursor-pointer">
                <div className="flex items-start transition-transform transform group-hover:-translate-y-1">
                  <span className="text-gray-400 mt-1 sm:mt-2 mr-1 group-hover:text-gray-600 transition-colors">
                    {getIconForStat(stat.icon)}
                  </span>
                  <span className="text-2xl sm:text-4xl lg:text-6xl font-light tracking-tight text-gray-900">{stat.value}</span>
                </div>
                <span className="text-[10px] sm:text-sm font-medium text-gray-500 mt-1 group-hover:text-gray-800 transition-colors">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 sm:gap-6">
          
          {/* Left Column (Profile & List) */}
          <div className="md:col-span-1 xl:col-span-3 space-y-6 flex flex-col">
            {/* Profile Card */}
            <div className="bg-white/40 backdrop-blur-xl rounded-[32px] p-4 border border-white/60 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-0"></div>
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}&backgroundColor=b6e3f4`}
                alt="Profile"
                className="w-full aspect-[4/3] object-cover rounded-2xl mb-2 relative z-10 transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-end">
                <div>
                  <h3 className="text-white font-semibold text-xl">{user?.name}</h3>
                  <p className="text-white/90 text-sm font-medium">{user?.role}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 text-white text-xs font-semibold uppercase tracking-wider">
                  {currentData.profileBadge}
                </div>
              </div>
            </div>
            
            {/* Accordion List */}
            <div className="bg-white/40 backdrop-blur-xl rounded-[32px] p-6 border border-white/60 shadow-sm space-y-2 flex-1">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                {user?.role === 'Admin' ? 'System Alerts' : user?.role === 'Teacher' ? 'Notifications' : 'Quick Links'}
              </h3>
              {currentData.listItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-200/50 last:border-0 cursor-pointer hover:bg-white/40 rounded-lg px-2 -mx-2 transition-colors group">
                  <div className="flex items-center gap-3">
                    {getIconForListItem(item.type)}
                    <span className="font-medium text-gray-800 group-hover:text-black">{item.title}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>

          {/* Center Column (Charts) */}
          <div className="md:col-span-1 xl:col-span-5 space-y-6 flex flex-col">
            {/* Progress Bar Chart */}
            <div className="bg-white/40 backdrop-blur-xl rounded-2xl sm:rounded-[32px] p-4 sm:p-6 border border-white/60 shadow-sm min-h-[280px] sm:min-h-[320px] flex flex-col hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4 sm:mb-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">{currentData.progressTitle}</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-light text-gray-900">{currentData.progressValue}</span>
                    <span className="text-sm text-gray-500">{currentData.progressSubtitle}</span>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <Tooltip 
                      cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                    <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={8}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 3 ? '#4f46e5' : '#e0e7ff'} className="hover:opacity-80 transition-opacity cursor-pointer" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Time Tracker */}
            <div className="bg-white/60 backdrop-blur-xl rounded-[32px] p-6 lg:p-8 border border-white/60 shadow-sm min-h-[280px] sm:min-h-[320px] flex flex-col relative overflow-hidden hover:shadow-md transition-shadow flex-1">
              <div className="flex justify-between items-start z-10">
                <h3 className="text-lg font-medium text-gray-800">{currentData.trackerTitle}</h3>
                <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center z-10 py-4">
                <div className="relative w-36 h-36 sm:w-48 sm:h-48 flex items-center justify-center group cursor-pointer">
                  {/* Circular dashed border simulation */}
                  <svg className="absolute inset-0 w-full h-full transform group-hover:scale-105 transition-transform duration-500" viewBox="0 0 100 100">
                    {/* Background Arc */}
                    <path d="M 15 80 A 45 45 0 1 1 85 80" fill="none" stroke="#E5E7EB" strokeWidth="6" strokeLinecap="round" />
                    {/* Foreground Arc */}
                    <path d="M 15 80 A 45 45 0 1 1 85 80" fill="none" stroke="#4f46e5" strokeWidth="6" strokeDasharray="10 6" strokeLinecap="round" />
                  </svg>
                  <div className="text-center mt-2 sm:mt-4">
                    <div className="text-2xl sm:text-4xl font-light text-gray-900">{currentData.trackerTime}</div>
                    <div className="text-[10px] sm:text-xs text-gray-500 mt-1">{currentData.trackerSubtitle}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-3 sm:gap-4 mt-2 z-10">
                <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 text-gray-600 hover:bg-gray-50 hover:scale-105 transition-all">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-1" />
                </button>
                <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 text-gray-600 hover:bg-gray-50 hover:scale-105 transition-all">
                  <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-sm text-white hover:bg-blue-700 hover:scale-105 transition-all ml-auto">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (Onboarding & Tasks) */}
          <div className="md:col-span-2 xl:col-span-4 space-y-6 flex flex-col">
            {/* Onboarding Bars */}
            <div className="bg-white/60 backdrop-blur-xl rounded-[32px] p-6 lg:p-8 border border-white/60 shadow-sm min-h-[280px] sm:min-h-[320px] hover:shadow-md transition-shadow">
              <div className="flex justify-between items-end mb-6 sm:mb-8">
                <h3 className="text-lg font-medium text-gray-800">{currentData.barsTitle}</h3>
                <span className="text-2xl sm:text-4xl font-light text-gray-900">18%</span>
              </div>
              
              <div className="flex flex-wrap gap-3 sm:gap-4 mt-6 justify-center">
                {currentData.bars.map((bar, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 sm:gap-4 flex-1">
                    <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-medium text-center leading-tight shadow-sm ${bar.color} ${bar.color.includes('bg-gray-300') ? 'text-transparent' : ''}`}>
                      {bar.label}
                    </div>
                    <span className="text-[10px] sm:text-xs font-medium text-gray-500">{bar.value}%</span>
                  </div>
                ))}
                <div className="flex flex-col items-center gap-2 sm:gap-4 flex-1">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-medium text-transparent bg-gray-200 shadow-sm">
                    Empty
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-gray-500">0%</span>
                </div>
              </div>
            </div>

            {/* Dark Task Card */}
            <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-[32px] p-6 lg:p-8 text-white shadow-xl min-h-[320px] flex flex-col flex-1">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-medium text-white/90">{currentData.tasksTitle}</h3>
                <span className="text-3xl font-light text-white">
                  {currentData.tasks.filter((t, i) => t.done || activeTasks.includes(i)).length}/{currentData.tasks.length}
                </span>
              </div>
              
              <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                {currentData.tasks.map((task, idx) => {
                  const isDone = task.done || activeTasks.includes(idx);
                  return (
                    <div 
                      key={idx} 
                      onClick={() => toggleTask(idx)}
                      className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group"
                    >
                      <div className={`mt-1 flex-shrink-0 transition-colors ${isDone ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-400'}`}>
                        {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate transition-all ${isDone ? 'text-white/60 line-through' : 'text-white/90 group-hover:text-white'}`}>
                          {task.title}
                        </p>
                        <p className="text-xs text-white/40 mt-1">{task.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

