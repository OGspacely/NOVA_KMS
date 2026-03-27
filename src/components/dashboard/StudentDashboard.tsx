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
    <div className="bg-[#EBF2FA] min-h-screen p-8 rounded-[40px] font-sans text-[#1A202C]">
      {/* Top Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
        <div>
          <h1 className="text-4xl font-semibold mb-6">Welcome in, {user?.name?.split(' ')[0] || 'Student'}</h1>
          
          {/* Progress Bars (Subject Progress) */}
          <div className="flex flex-wrap gap-4 text-sm font-medium">
            <div className="flex flex-col gap-2">
              <span className="text-gray-500">Mathematics</span>
              <div className="w-24 h-8 bg-[#1E3A8A] text-white rounded-full flex items-center px-3">25%</div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-gray-500">Science</span>
              <div className="w-24 h-8 bg-[#1D4ED8] text-white rounded-full flex items-center px-3">50%</div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-gray-500">English</span>
              <div className="w-24 h-8 bg-[#2563EB] text-white rounded-full flex items-center px-3">48%</div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-gray-500">History</span>
              <div className="w-24 h-8 bg-[#3B82F6] text-white rounded-full flex items-center px-3">65%</div>
            </div>
            <div className="flex flex-col gap-2 ml-4">
              <span className="text-gray-500">Overall</span>
              <div className="w-24 h-8 border border-gray-300 text-gray-700 rounded-full flex items-center px-3 bg-white/50">65%</div>
            </div>
          </div>
        </div>

        {/* Quick Stats Numbers */}
        <div className="flex gap-8 lg:ml-auto">
          <div className="text-center">
            <div className="text-5xl font-light text-gray-800 flex items-center justify-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-500" /> {stats.resources || 92}
            </div>
            <div className="text-sm text-gray-500 mt-1">Resources</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-light text-gray-800 flex items-center justify-center gap-2">
              <CheckCircle className="w-6 h-6 text-blue-500" /> {stats.quizzes || 75}
            </div>
            <div className="text-sm text-gray-500 mt-1">Quizzes</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-light text-gray-800 flex items-center justify-center gap-2">
              <Clock className="w-6 h-6 text-blue-500" /> {stats.hours || 315}
            </div>
            <div className="text-sm text-gray-500 mt-1">Hours</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (Profile & Accordions) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Card */}
          <div className="bg-gradient-to-b from-blue-100 to-blue-200 rounded-3xl p-6 flex flex-col items-center text-center shadow-sm relative overflow-hidden">
            <div className="w-32 h-32 rounded-2xl bg-white/50 mb-4 overflow-hidden border-4 border-white shadow-sm">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Student'}&backgroundColor=e2e8f0`} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-semibold">{user?.name || 'Alex Chen'}</h2>
            <p className="text-sm text-gray-600 mb-4">{user?.program || 'High School Student'}</p>
            <div className="bg-black/40 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> 1,500 pts
            </div>
          </div>

          {/* Accordion Menu */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-4 space-y-2">
            <div className="flex items-center justify-between p-3 hover:bg-white/50 rounded-xl cursor-pointer transition-colors">
              <span className="font-medium text-gray-700">Achievements & Badges</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
            <div className="border-t border-gray-200/50 my-1"></div>
            <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Consistent Learner</div>
                  <div className="text-xs text-gray-500">7-day streak</div>
                </div>
              </div>
              <span className="text-gray-400">⋮</span>
            </div>
            <div className="border-t border-gray-200/50 my-1"></div>
            <div className="flex items-center justify-between p-3 hover:bg-white/50 rounded-xl cursor-pointer transition-colors">
              <span className="font-medium text-gray-700">Engagement Metrics</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
            <div className="border-t border-gray-200/50 my-1"></div>
            <div className="flex items-center justify-between p-3 hover:bg-white/50 rounded-xl cursor-pointer transition-colors">
              <span className="font-medium text-gray-700">Activity History</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Middle Column (Charts & Calendar) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Progress Chart */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Learning Activity</h3>
                  <div className="text-3xl font-light mt-1">6.1 h <span className="text-sm text-gray-500">Study Time this week</span></div>
                </div>
                <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">↗</button>
              </div>
              
              {/* Mock Bar Chart */}
              <div className="flex items-end justify-between h-32 mt-8 pb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => {
                  const heights = [30, 60, 40, 80, 50, 20, 40];
                  const isToday = i === 4;
                  return (
                    <div key={i} className="flex flex-col items-center gap-2">
                      {isToday && (
                        <div className="bg-blue-600 text-white text-[10px] px-2 py-1 rounded-full mb-1">
                          1h 25m
                        </div>
                      )}
                      <div className="w-3 bg-gray-100 rounded-full h-24 relative overflow-hidden">
                        <div 
                          className={`absolute bottom-0 w-full rounded-full ${isToday ? 'bg-blue-600' : 'bg-gray-800'}`} 
                          style={{ height: `${heights[i]}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-400 font-medium">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Time Tracker */}
            <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900">Study Session</h3>
                <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">↗</button>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center relative">
                {/* Circular Progress Mock */}
                <div className="w-40 h-40 rounded-full border-[12px] border-gray-100 relative flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="#2563EB" strokeWidth="12" strokeDasharray="276" strokeDashoffset="100" strokeLinecap="round" />
                  </svg>
                  <div className="text-center">
                    <div className="text-3xl font-light text-gray-900">03:45</div>
                    <div className="text-xs text-gray-500 mt-1">Study Time</div>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200">
                    <Play className="w-4 h-4 ml-1" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200">
                    <Pause className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar / Timeline */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <button className="px-4 py-1.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600">August</button>
              <h3 className="text-lg font-medium text-gray-900">September 2024</h3>
              <button className="px-4 py-1.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600">October</button>
            </div>

            {/* Days row */}
            <div className="flex justify-between mb-6 text-center">
              {[
                { d: 'Mon', n: '22' },
                { d: 'Tue', n: '23' },
                { d: 'Wed', n: '24', active: true },
                { d: 'Thu', n: '25' },
                { d: 'Fri', n: '26' },
                { d: 'Sat', n: '27' },
              ].map((day, i) => (
                <div key={i} className={`flex flex-col gap-1 ${day.active ? 'text-blue-600' : 'text-gray-400'}`}>
                  <span className="text-xs font-medium">{day.d}</span>
                  <span className={`text-sm ${day.active ? 'font-bold' : ''}`}>{day.n}</span>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div className="relative border-l border-gray-100 ml-4 py-2 space-y-6">
              <div className="relative pl-6">
                <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                <div className="text-xs text-gray-400 absolute -left-16 top-0">8:00 AM</div>
                <div className="bg-gray-50 rounded-xl p-3 inline-flex items-center gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Math Assignment Due</div>
                    <div className="text-xs text-gray-500">Algebra Chapter 4</div>
                  </div>
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white"></div>
                    <div className="w-6 h-6 rounded-full bg-green-100 border-2 border-white"></div>
                  </div>
                </div>
              </div>

              <div className="relative pl-6">
                <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                <div className="text-xs text-gray-400 absolute -left-16 top-0">10:00 AM</div>
                <div className="bg-blue-600 text-white rounded-xl p-3 inline-flex items-center gap-4 shadow-md">
                  <div>
                    <div className="text-sm font-medium">Science Quiz</div>
                    <div className="text-xs text-blue-100">Cellular Biology Basics</div>
                  </div>
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-white/20 border-2 border-blue-600"></div>
                    <div className="w-6 h-6 rounded-full bg-white/20 border-2 border-blue-600"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Tasks & Overall Progress) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Overall Progress */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Course Progress</h3>
              <span className="text-3xl font-light text-gray-900">42%</span>
            </div>
            
            <div className="flex gap-2 mb-2">
              <div className="flex-1 text-xs text-gray-500">Completed</div>
              <div className="flex-1 text-xs text-gray-500">In Progress</div>
              <div className="flex-1 text-xs text-gray-500">Pending</div>
            </div>
            
            <div className="flex gap-1 h-8">
              <div className="w-[42%] bg-blue-600 rounded-l-full flex items-center justify-center text-white text-xs font-medium">42%</div>
              <div className="w-[25%] bg-[#1E3A8A] flex items-center justify-center text-white text-xs font-medium">25%</div>
              <div className="w-[33%] bg-gray-200 rounded-r-full flex items-center justify-center text-gray-500 text-xs font-medium">33%</div>
            </div>
          </div>

          {/* Recommendations / Pending Tasks */}
          <div className="bg-[#1E3A8A] rounded-3xl p-6 shadow-sm text-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Recommendations</h3>
              <span className="text-2xl font-light">{recommendations.length > 0 ? recommendations.length : '3/8'}</span>
            </div>
            
            <div className="space-y-4">
              {recommendations.length > 0 ? recommendations.map((rec: any, i: number) => (
                <div key={rec._id} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">
                    {rec.type === 'video' ? '📺' : '📝'}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white line-clamp-1">{rec.title}</div>
                    <div className="text-xs text-blue-300">{rec.subject?.name || 'General'}</div>
                  </div>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center border border-blue-400">
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
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">
                      {task.icon}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${task.done ? 'text-blue-200 line-through' : 'text-white'}`}>{task.title}</div>
                      <div className="text-xs text-blue-300">{task.time}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${task.done ? 'bg-blue-400 text-white' : 'border border-blue-400'}`}>
                      {task.done && <CheckCircle className="w-3 h-3" />}
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
