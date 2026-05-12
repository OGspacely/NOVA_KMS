import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import api from '../../api/axios.ts';
import { CheckCircle, Clock, Award, BookOpen, Star, Play, Pause, ChevronRight } from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    resources: 0,
    quizzes: 0,
    hours: 0
  });
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const res = await api.get('/articles');
        const articlesData = Array.isArray(res.data) ? res.data : [];
        setStats({
          resources: articlesData.length,
          quizzes: 5, // Mock
          hours: Math.floor(articlesData.length * 1.5) // Mock
        });
        
        const shuffled = [...articlesData].sort(() => 0.5 - Math.random());
        setRecommendations(shuffled.slice(0, 5));
      } catch (error) {
        console.error('Error fetching student data', error);
      }
    };
    fetchStudentData();
  }, []);

  return (
    <div className="bg-[#EBF2FA] min-h-screen p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[40px] font-sans text-[#1A202C]">
      {/* Top Header Section */}
      <div className="flex flex-col gap-6 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4 sm:mb-6">
            Welcome in, {user?.name?.split(' ')[0] || 'Student'}
          </h1>
          
          {/* Progress Bars (Subject Progress) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 text-sm font-medium">
            <div className="flex flex-col gap-2">
              <span className="text-gray-500 text-xs sm:text-sm">Mathematics</span>
              <div className="h-8 bg-[#1E3A8A] text-white rounded-full flex items-center px-3 text-xs sm:text-sm">25%</div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-gray-500 text-xs sm:text-sm">Science</span>
              <div className="h-8 bg-[#1D4ED8] text-white rounded-full flex items-center px-3 text-xs sm:text-sm">50%</div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-gray-500 text-xs sm:text-sm">English</span>
              <div className="h-8 bg-[#2563EB] text-white rounded-full flex items-center px-3 text-xs sm:text-sm">48%</div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-gray-500 text-xs sm:text-sm">History</span>
              <div className="h-8 bg-[#3B82F6] text-white rounded-full flex items-center px-3 text-xs sm:text-sm">65%</div>
            </div>
            <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
              <span className="text-gray-500 text-xs sm:text-sm">Overall</span>
              <div className="h-8 border border-gray-300 text-gray-700 rounded-full flex items-center px-3 bg-white/50 text-xs sm:text-sm">65%</div>
            </div>
          </div>
        </div>

        {/* Quick Stats Numbers */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 bg-white/50 rounded-2xl p-4 sm:p-0 sm:bg-transparent">
          <div className="text-center">
            <div className="text-2xl sm:text-4xl lg:text-5xl font-light text-gray-800 flex items-center justify-center gap-1 sm:gap-2">
              <BookOpen className="w-4 h-4 sm:w-6 sm:h-6 text-blue-500" /> {stats.resources || 92}
            </div>
            <div className="text-xs sm:text-sm text-gray-500 mt-1">Resources</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-4xl lg:text-5xl font-light text-gray-800 flex items-center justify-center gap-1 sm:gap-2">
              <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-blue-500" /> {stats.quizzes || 75}
            </div>
            <div className="text-xs sm:text-sm text-gray-500 mt-1">Quizzes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-4xl lg:text-5xl font-light text-gray-800 flex items-center justify-center gap-1 sm:gap-2">
              <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-blue-500" /> {stats.hours || 315}
            </div>
            <div className="text-xs sm:text-sm text-gray-500 mt-1">Hours</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Left Column (Profile & Accordions) - Hidden on mobile, shown as horizontal on tablet */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
          {/* Profile Card */}
          <div className="bg-gradient-to-b from-blue-100 to-blue-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-row sm:flex-col items-center sm:text-center shadow-sm relative overflow-hidden gap-4 sm:gap-0">
            <div className="w-16 h-16 sm:w-32 sm:h-32 rounded-xl sm:rounded-2xl bg-white/50 sm:mb-4 overflow-hidden border-2 sm:border-4 border-white shadow-sm flex-shrink-0">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Student'}&backgroundColor=e2e8f0`} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 sm:flex-initial">
              <h2 className="text-lg sm:text-xl font-semibold">{user?.name || 'Alex Chen'}</h2>
              <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-4">{user?.program || 'High School Student'}</p>
              <div className="bg-black/40 backdrop-blur-md text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium inline-flex items-center gap-1">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" /> 1,500 pts
              </div>
            </div>
          </div>

          {/* Accordion Menu */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-4 space-y-2">
            <div className="flex items-center justify-between p-2.5 sm:p-3 hover:bg-white/50 rounded-xl cursor-pointer transition-colors">
              <span className="font-medium text-gray-700 text-sm sm:text-base">Achievements & Badges</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
            <div className="border-t border-gray-200/50 my-1"></div>
            <div className="flex items-center justify-between p-2.5 sm:p-3 bg-white rounded-xl shadow-sm cursor-pointer">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">Consistent Learner</div>
                  <div className="text-[10px] sm:text-xs text-gray-500">7-day streak</div>
                </div>
              </div>
              <span className="text-gray-400">⋮</span>
            </div>
            <div className="border-t border-gray-200/50 my-1"></div>
            <div className="flex items-center justify-between p-2.5 sm:p-3 hover:bg-white/50 rounded-xl cursor-pointer transition-colors">
              <span className="font-medium text-gray-700 text-sm sm:text-base">Engagement Metrics</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
            <div className="border-t border-gray-200/50 my-1"></div>
            <div className="flex items-center justify-between p-2.5 sm:p-3 hover:bg-white/50 rounded-xl cursor-pointer transition-colors">
              <span className="font-medium text-gray-700 text-sm sm:text-base">Activity History</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Middle Column (Charts & Calendar) */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Progress Chart */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900">Learning Activity</h3>
                  <div className="text-xl sm:text-3xl font-light mt-1">6.1 h <span className="text-xs sm:text-sm text-gray-500">Study Time this week</span></div>
                </div>
                <button className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 text-sm">↗</button>
              </div>
              
              {/* Mock Bar Chart */}
              <div className="flex items-end justify-between h-24 sm:h-32 mt-4 sm:mt-8 pb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => {
                  const heights = [30, 60, 40, 80, 50, 20, 40];
                  const isToday = i === 4;
                  return (
                    <div key={i} className="flex flex-col items-center gap-1 sm:gap-2 flex-1">
                      {isToday && (
                        <div className="bg-blue-600 text-white text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full mb-0.5 sm:mb-1 whitespace-nowrap">
                          1h 25m
                        </div>
                      )}
                      <div className="w-2 sm:w-3 bg-gray-100 rounded-full h-16 sm:h-24 relative overflow-hidden">
                        <div 
                          className={`absolute bottom-0 w-full rounded-full ${isToday ? 'bg-blue-600' : 'bg-gray-800'}`} 
                          style={{ height: `${heights[i]}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] sm:text-xs text-gray-400 font-medium">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Time Tracker */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-base sm:text-lg font-medium text-gray-900">Study Session</h3>
                <button className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 text-sm">↗</button>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center relative py-2">
                {/* Circular Progress Mock */}
                <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-full border-[8px] sm:border-[12px] border-gray-100 relative flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="#2563EB" strokeWidth="12" strokeDasharray="276" strokeDashoffset="100" strokeLinecap="round" />
                  </svg>
                  <div className="text-center">
                    <div className="text-xl sm:text-3xl font-light text-gray-900">03:45</div>
                    <div className="text-[10px] sm:text-xs text-gray-500 mt-1">Study Time</div>
                  </div>
                </div>
                
                <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-6">
                  <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 active:scale-95 transition-transform">
                    <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5" />
                  </button>
                  <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 active:scale-95 transition-transform">
                    <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar / Timeline */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <button className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-gray-200 text-xs sm:text-sm font-medium text-gray-600">August</button>
              <h3 className="text-sm sm:text-lg font-medium text-gray-900">September 2024</h3>
              <button className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-gray-200 text-xs sm:text-sm font-medium text-gray-600">October</button>
            </div>

            {/* Days row */}
            <div className="flex justify-between mb-4 sm:mb-6 text-center overflow-x-auto">
              {[
                { d: 'Mon', n: '22' },
                { d: 'Tue', n: '23' },
                { d: 'Wed', n: '24', active: true },
                { d: 'Thu', n: '25' },
                { d: 'Fri', n: '26' },
                { d: 'Sat', n: '27' },
              ].map((day, i) => (
                <div key={i} className={`flex flex-col gap-1 px-2 sm:px-0 ${day.active ? 'text-blue-600' : 'text-gray-400'}`}>
                  <span className="text-[10px] sm:text-xs font-medium">{day.d}</span>
                  <span className={`text-xs sm:text-sm ${day.active ? 'font-bold' : ''}`}>{day.n}</span>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div className="relative border-l border-gray-100 ml-2 sm:ml-4 py-2 space-y-4 sm:space-y-6">
              <div className="relative pl-4 sm:pl-6">
                <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                <div className="text-xs text-gray-400 hidden sm:block absolute -left-16 top-0">8:00 AM</div>
                <div className="bg-gray-50 rounded-xl p-2.5 sm:p-3 flex items-center gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">Math Assignment Due</div>
                    <div className="text-[10px] sm:text-xs text-gray-500">Algebra Chapter 4</div>
                  </div>
                  <div className="flex -space-x-2 flex-shrink-0">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-100 border-2 border-white"></div>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-100 border-2 border-white"></div>
                  </div>
                </div>
              </div>

              <div className="relative pl-4 sm:pl-6">
                <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                <div className="text-xs text-gray-400 hidden sm:block absolute -left-16 top-0">10:00 AM</div>
                <div className="bg-blue-600 text-white rounded-xl p-2.5 sm:p-3 flex items-center gap-3 sm:gap-4 shadow-md">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm font-medium truncate">Science Quiz</div>
                    <div className="text-[10px] sm:text-xs text-blue-100">Cellular Biology Basics</div>
                  </div>
                  <div className="flex -space-x-2 flex-shrink-0">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 border-2 border-blue-600"></div>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 border-2 border-blue-600"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Tasks & Overall Progress) */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
          {/* Overall Progress */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">Course Progress</h3>
              <span className="text-2xl sm:text-3xl font-light text-gray-900">42%</span>
            </div>
            
            <div className="flex gap-2 mb-2">
              <div className="flex-1 text-[10px] sm:text-xs text-gray-500">Completed</div>
              <div className="flex-1 text-[10px] sm:text-xs text-gray-500">In Progress</div>
              <div className="flex-1 text-[10px] sm:text-xs text-gray-500">Pending</div>
            </div>
            
            <div className="flex gap-1 h-7 sm:h-8">
              <div className="w-[42%] bg-blue-600 rounded-l-full flex items-center justify-center text-white text-[10px] sm:text-xs font-medium">42%</div>
              <div className="w-[25%] bg-[#1E3A8A] flex items-center justify-center text-white text-[10px] sm:text-xs font-medium">25%</div>
              <div className="w-[33%] bg-gray-200 rounded-r-full flex items-center justify-center text-gray-500 text-[10px] sm:text-xs font-medium">33%</div>
            </div>
          </div>

          {/* Recommendations / Pending Tasks */}
          <div className="bg-[#1E3A8A] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm text-white">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-medium">Recommendations</h3>
              <span className="text-xl sm:text-2xl font-light">{recommendations.length > 0 ? recommendations.length : '3/8'}</span>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {recommendations.length > 0 ? recommendations.map((rec: any, i: number) => (
                <div key={rec._id} className="flex items-center gap-3 sm:gap-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 flex items-center justify-center text-xs sm:text-sm flex-shrink-0">
                    {rec.type === 'video' ? '📺' : '📝'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm font-medium text-white line-clamp-1">{rec.title}</div>
                    <div className="text-[10px] sm:text-xs text-blue-300">{rec.subject?.name || 'General'}</div>
                  </div>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border border-blue-400 flex-shrink-0">
                  </div>
                </div>
              )) : (
                [
                  { title: 'Read: Intro to Physics', time: 'Sep 12, 10:30', icon: '📺', done: true },
                  { title: 'Quiz: Algebra Basics', time: 'Sep 13, 10:30', icon: '⚡', done: true },
                  { title: 'Review: World War II', time: 'Sep 14, 15:45', icon: '📝', done: true },
                  { title: 'Read: Cellular Biology', time: 'Sep 15, 11:45', icon: '🎯', done: false },
                  { title: 'Submit Essay Draft', time: 'Sep 16, 16:30', icon: '🔗', done: false },
                ].map((task, i) => (
                  <div key={i} className="flex items-center gap-3 sm:gap-4">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 flex items-center justify-center text-xs sm:text-sm flex-shrink-0">
                      {task.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs sm:text-sm font-medium truncate ${task.done ? 'text-blue-200 line-through' : 'text-white'}`}>{task.title}</div>
                      <div className="text-[10px] sm:text-xs text-blue-300">{task.time}</div>
                    </div>
                    <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 ${task.done ? 'bg-blue-400 text-white' : 'border border-blue-400'}`}>
                      {task.done && <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
