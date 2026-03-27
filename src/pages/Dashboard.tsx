import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import api from '../api/axios.ts';
import { Link } from 'react-router-dom';
import { BookOpen, Users, CheckCircle, Clock, Bell } from 'lucide-react';
import { StudentDashboard } from '../components/dashboard/StudentDashboard.tsx';

export const Dashboard = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [stats, setStats] = useState(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', targetAudience: 'All' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/articles');
        const articlesData = Array.isArray(res.data) ? res.data : [];
        setArticles(articlesData.slice(0, 5)); // Get latest 5
        
        // Simple mock recommendation logic: just shuffle or take next 3
        const shuffled = [...articlesData].sort(() => 0.5 - Math.random());
        setRecommended(shuffled.slice(0, 3));
        
        const announcementsRes = await api.get('/announcements');
        setAnnouncements(Array.isArray(announcementsRes.data) ? announcementsRes.data : []);

        if (user?.role === 'Admin') {
          const statsRes = await api.get('/admin/stats');
          setStats(statsRes.data);
        }
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchData();
  }, [user]);

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/announcements', newAnnouncement);
      setAnnouncements([res.data, ...announcements]);
      setShowAnnouncementForm(false);
      setNewAnnouncement({ title: '', content: '', targetAudience: 'All' });
    } catch (error) {
      console.error('Error creating announcement', error);
    }
  };

  if (user?.role === 'Student') {
    return <StudentDashboard />;
  }

  return (
    <div className="space-y-6">
      {/* Announcements Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-500" />
            Announcements
          </h2>
          {(user?.role === 'Teacher' || user?.role === 'Admin') && (
            <button 
              onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl transition-colors"
            >
              Post Announcement
            </button>
          )}
        </div>

        {showAnnouncementForm && (
          <form onSubmit={handleCreateAnnouncement} className="mb-6 bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <div className="space-y-4">
              <div>
                <input 
                  type="text" 
                  placeholder="Announcement Title"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <textarea 
                  placeholder="Announcement Content"
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <select 
                  value={newAnnouncement.targetAudience}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, targetAudience: e.target.value })}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Users</option>
                  <option value="Students">Students Only</option>
                  <option value="Teachers">Teachers Only</option>
                </select>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowAnnouncementForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">Post</button>
                </div>
              </div>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement._id} className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900">{announcement.title}</h3>
                <span className="text-xs text-gray-500">{new Date(announcement.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-700 text-sm">{announcement.content}</p>
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 font-medium">
                <div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center text-amber-700">
                  {announcement.author?.name?.charAt(0)}
                </div>
                {announcement.author?.name} • {announcement.author?.role}
              </div>
            </div>
          ))}
          {announcements.length === 0 && (
            <p className="text-gray-500 text-center py-4">No recent announcements.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <div className="text-sm text-gray-500 font-medium">Total Articles</div>
            <div className="text-2xl font-bold text-gray-900">{stats?.articles?.total || articles.length * 3}</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
            <CheckCircle className="w-7 h-7" />
          </div>
          <div>
            <div className="text-sm text-gray-500 font-medium">Approved</div>
            <div className="text-2xl font-bold text-gray-900">{stats?.articles?.approved || articles.length}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <div className="text-sm text-gray-500 font-medium">Pending Review</div>
            <div className="text-2xl font-bold text-gray-900">{stats?.articles?.pending || 0}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <div className="text-sm text-gray-500 font-medium">Active Users</div>
            <div className="text-2xl font-bold text-gray-900">{stats?.users || 42}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Articles</h2>
            <Link to="/articles" className="text-blue-600 font-medium hover:underline text-sm">View All</Link>
          </div>
          
          <div className="space-y-4">
            {articles.map((article: any) => (
              <Link key={article._id} to={`/articles/${article._id}`} className="block group">
                <div className="p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{article.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      <span>{article.author?.name}</span>
                      <span>•</span>
                      <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                    {article.status}
                  </div>
                </div>
              </Link>
            ))}
            {articles.length === 0 && (
              <div className="text-center py-8 text-gray-500">No articles found.</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recommended for You</h2>
          <div className="space-y-4">
            {recommended.map((article: any) => (
              <Link key={article._id} to={`/articles/${article._id}`} className="block group">
                <div className="p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-[10px] font-semibold uppercase tracking-wider mb-2 inline-block">
                    {article.subject?.name || 'Subject'}
                  </span>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2 text-sm">{article.title}</h3>
                </div>
              </Link>
            ))}
            {recommended.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">No recommendations yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
