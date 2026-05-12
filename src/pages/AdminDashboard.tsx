import React, { useEffect, useState } from 'react';
import api from '../api/axios.ts';
import { Users, FileText, CheckCircle, XCircle, Clock, Search, Activity, Settings, AlertTriangle, Server, MessageSquare, Database, ShieldAlert, Download, RefreshCw } from 'lucide-react';
import { UserList } from '../components/admin/UserList.tsx';
import { ArticleList } from '../components/admin/ArticleList.tsx';
import { TaxonomyManager } from '../components/admin/TaxonomyManager.tsx';
import { AuditLogs } from '../components/admin/AuditLogs.tsx';
import { SystemSettings } from '../components/admin/SystemSettings.tsx';

export const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'users' | 'articles' | 'taxonomy' | 'audit' | 'settings'>('dashboard');
  const [articleStatus, setArticleStatus] = useState<string>('All');

  useEffect(() => {
    if (activeView === 'dashboard') {
      const fetchStats = async () => {
        try {
          const res = await api.get('/admin/stats');
          setStats(res.data);
        } catch (error) {
          console.error('Error fetching admin stats', error);
        }
      };
      fetchStats();
    }
  }, [activeView]);

  if (!stats && activeView === 'dashboard') return <div className="p-8 text-center text-gray-500">Loading...</div>;

  if (activeView === 'users') {
    return <UserList onBack={() => setActiveView('dashboard')} />;
  }

  if (activeView === 'articles') {
    return <ArticleList onBack={() => setActiveView('dashboard')} initialStatus={articleStatus} />;
  }

  if (activeView === 'taxonomy') {
    return <TaxonomyManager onBack={() => setActiveView('dashboard')} />;
  }

  if (activeView === 'audit') {
    return <AuditLogs onBack={() => setActiveView('dashboard')} />;
  }

  if (activeView === 'settings') {
    return <SystemSettings onBack={() => setActiveView('dashboard')} />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-xs sm:text-sm font-medium">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span> Report
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span> Announce
          </button>
        </div>
      </div>

      {/* TOP: System Overview */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          System Overview
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-[10px] sm:text-sm text-gray-500 font-medium mb-0.5 sm:mb-1 truncate">Total Users</div>
              <div className="text-xl sm:text-3xl font-bold text-gray-900">{stats.users}</div>
              <div className="text-[10px] sm:text-xs text-green-600 mt-1 sm:mt-2 flex items-center gap-1">
                <Activity className="w-3 h-3" /> +12%
              </div>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <Users className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-[10px] sm:text-sm text-gray-500 font-medium mb-0.5 sm:mb-1 truncate">Active Users</div>
              <div className="text-xl sm:text-3xl font-bold text-gray-900">{Math.floor(stats.users * 0.4) || 24}</div>
              <div className="text-[10px] sm:text-xs text-gray-500 mt-1 sm:mt-2">Daily active</div>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
              <Activity className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-[10px] sm:text-sm text-gray-500 font-medium mb-0.5 sm:mb-1 truncate">Total Content</div>
              <div className="text-xl sm:text-3xl font-bold text-gray-900">{stats.articles.total}</div>
              <div className="text-[10px] sm:text-xs text-green-600 mt-1 sm:mt-2 flex items-center gap-1">
                <Activity className="w-3 h-3" /> +5
              </div>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <FileText className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-[10px] sm:text-sm text-gray-500 font-medium mb-0.5 sm:mb-1 truncate">Usage</div>
              <div className="text-xl sm:text-3xl font-bold text-gray-900">84%</div>
              <div className="text-[10px] sm:text-xs text-gray-500 mt-1 sm:mt-2">Capacity load</div>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
              <Database className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MIDDLE: Content Moderation + User Activity (Takes up 2 columns) */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-orange-600" />
              Content Moderation
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div 
                onClick={() => { setArticleStatus('Pending'); setActiveView('articles'); }}
                className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:border-orange-200 transition-all text-center"
              >
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 mx-auto mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.articles.pending}</div>
                <div className="text-[10px] sm:text-xs text-gray-500 mt-1">Pending</div>
              </div>
              <div 
                onClick={() => { setArticleStatus('Approved'); setActiveView('articles'); }}
                className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:border-green-200 transition-all text-center"
              >
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mx-auto mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.articles.approved}</div>
                <div className="text-[10px] sm:text-xs text-gray-500 mt-1">Approved</div>
              </div>
              <div 
                onClick={() => { setArticleStatus('Rejected'); setActiveView('articles'); }}
                className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:border-red-200 transition-all text-center"
              >
                <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mx-auto mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.articles.rejected}</div>
                <div className="text-[10px] sm:text-xs text-gray-500 mt-1">Rejected</div>
              </div>
              <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:border-purple-200 transition-all text-center">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 mx-auto mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-gray-900">0</div>
                <div className="text-[10px] sm:text-xs text-gray-500 mt-1">Flagged</div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              User Activity Monitoring
            </h2>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Recent Activity Logs</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All Logs</button>
              </div>
              <div className="divide-y divide-gray-50">
                {[
                  { user: 'Kwame Mensah', action: 'Submitted new article', time: '10 mins ago', type: 'content' },
                  { user: 'Abena Osei', action: 'Reported an issue', time: '1 hour ago', type: 'alert' },
                  { user: 'System', action: 'Automated backup completed', time: '3 hours ago', type: 'system' },
                  { user: 'Kofi Annan', action: 'Registered new account', time: '5 hours ago', type: 'user' },
                ].map((log, i) => (
                  <div key={i} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                    <div className={`w-2 h-2 rounded-full ${log.type === 'alert' ? 'bg-red-500' : log.type === 'system' ? 'bg-gray-500' : 'bg-blue-500'}`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900"><span className="font-medium">{log.user}</span> {log.action}</p>
                    </div>
                    <span className="text-xs text-gray-500">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* SIDE: Alerts + System Performance */}
        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Server className="w-5 h-5 text-gray-600" />
              System Performance
            </h2>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Platform Uptime</span>
                  <span className="font-medium text-green-600">99.99%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '99.99%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">System Load</span>
                  <span className="font-medium text-orange-600">42%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Error Rate</span>
                  <span className="font-medium text-gray-900">0.01%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '2%' }}></div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Alerts & Feedback
            </h2>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4">
              <div className="flex items-start gap-3 p-3 bg-red-50 text-red-800 rounded-xl">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold">Suspicious Activity</h4>
                  <p className="text-xs mt-1 opacity-90">Multiple failed login attempts detected from IP 192.168.1.105.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-orange-50 text-orange-800 rounded-xl">
                <MessageSquare className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold">User Complaint</h4>
                  <p className="text-xs mt-1 opacity-90">"Video playback is buffering frequently on mobile."</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* BOTTOM: Admin Actions */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-600" />
          Administrative Controls
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div 
            onClick={() => setActiveView('users')}
            className="p-5 bg-white border border-gray-100 rounded-2xl hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-900">User Management</h3>
              <p className="text-xs text-gray-500">Add, edit, suspend roles</p>
            </div>
          </div>

          <div 
            onClick={() => { setArticleStatus('All'); setActiveView('articles'); }}
            className="p-5 bg-white border border-gray-100 rounded-2xl hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-900">Content Management</h3>
              <p className="text-xs text-gray-500">All uploaded materials</p>
            </div>
          </div>

          <div 
            onClick={() => setActiveView('taxonomy')}
            className="p-5 bg-white border border-gray-100 rounded-2xl hover:border-purple-200 hover:shadow-sm transition-all cursor-pointer flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-900">Categorization</h3>
              <p className="text-xs text-gray-500">Manage subjects & topics</p>
            </div>
          </div>

          <div 
            onClick={() => setActiveView('audit')}
            className="p-5 bg-white border border-gray-100 rounded-2xl hover:border-green-200 hover:shadow-sm transition-all cursor-pointer flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-900">Audit Logs</h3>
              <p className="text-xs text-gray-500">View system activity history</p>
            </div>
          </div>

          <div 
            onClick={() => setActiveView('settings')}
            className="p-5 bg-white border border-gray-100 rounded-2xl hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-900">Backup & Restore</h3>
              <p className="text-xs text-gray-500">Manage system backups</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
