import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import api from '../api/axios.ts';
import { FileText, Clock, CheckCircle, XCircle, Search, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MySubmissions = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await api.get('/articles');
        const allArticles = Array.isArray(res.data) ? res.data : [];
        // Filter articles to only show the ones submitted by the current user
        // Assuming user object has _id or name that matches the article's author
        const myArticles = allArticles.filter(
          (article) => article.author?._id === user?._id || article.author?.name === user?.name
        );
        setSubmissions(myArticles);
      } catch (error) {
        console.error('Error fetching submissions', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-orange-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-orange-100 text-orange-700 border-orange-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-8 px-0 sm:px-4">
      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
          <FileText className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        <div>
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900">My Submissions</h1>
          <p className="text-gray-500 mt-0.5 sm:mt-1 text-xs sm:text-base">Track the status of the articles and resources you have contributed.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 flex gap-4 items-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg sm:rounded-xl flex items-center justify-center text-blue-600">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-[10px] sm:text-sm text-gray-500 font-medium">Total Submitted</div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{submissions.length}</div>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 flex gap-4 items-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-50 rounded-lg sm:rounded-xl flex items-center justify-center text-orange-600">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-[10px] sm:text-sm text-gray-500 font-medium">Pending Review</div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {submissions.filter(s => s.status === 'Pending').length}
            </div>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 flex gap-4 items-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-lg sm:rounded-xl flex items-center justify-center text-green-600">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-[10px] sm:text-sm text-gray-500 font-medium">Approved</div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {submissions.filter(s => s.status === 'Approved').length}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="font-bold text-base sm:text-lg text-gray-900">Submission History</h2>
        </div>
        
        {loading ? (
          <div className="p-12 text-center text-gray-500 text-sm sm:text-base">Loading submissions...</div>
        ) : submissions.length === 0 ? (
          <div className="p-8 sm:p-16 text-center flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No Submissions Yet</h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-6 max-w-md mx-auto px-4">You haven't submitted any articles for review yet. Start contributing to share your knowledge.</p>
            <Link 
              to="/editor" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-colors text-sm sm:text-base"
            >
              Contribute Now
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {submissions.map((submission) => (
              <div key={submission._id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 text-base sm:text-lg">{submission.title}</h3>
                    <span className={`px-2 py-0.5 flex items-center gap-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wider rounded-md border ${getStatusBadge(submission.status)}`}>
                      {getStatusIcon(submission.status)}
                      {submission.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                    <span className="font-medium bg-gray-100 px-1.5 py-0.5 rounded text-gray-700 text-[10px] sm:text-xs">
                      {submission.topic?.name || 'General'}
                    </span>
                    <span>Submitted on {new Date(submission.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3">
                  <Link 
                    to={`/articles/${submission._id}`}
                    className="flex-1 sm:flex-none text-center px-4 py-2 border border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-medium text-xs sm:text-sm flex items-center justify-center gap-2"
                  >
                    Details
                  </Link>
                  {submission.status === 'Rejected' && (
                    <Link 
                      to={`/editor?edit=${submission._id}`}
                      className="flex-1 sm:flex-none text-center px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-xl transition-all font-medium text-xs sm:text-sm flex items-center justify-center gap-2"
                    >
                      <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Resubmit
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
