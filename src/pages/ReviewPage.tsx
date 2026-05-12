import React, { useEffect, useState } from 'react';
import api from '../api/axios.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { Check, X, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ReviewPage = () => {
  const [pendingArticles, setPendingArticles] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await api.get('/articles/pending');
        setPendingArticles(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('Error fetching pending articles', error);
      }
    };
    fetchPending();
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      await api.put(`/articles/${id}/${action}`);
      setPendingArticles(pendingArticles.filter((a: any) => a._id !== id));
    } catch (error) {
      console.error(`Error ${action}ing article`, error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-0 sm:px-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center sm:text-left">Review Queue</h1>
        
        {/* Mobile View: Cards */}
        <div className="block sm:hidden space-y-4">
          {pendingArticles.map((article: any) => (
            <div key={article._id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-3">
              <div>
                <h3 className="font-bold text-gray-900">{article.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{article.author?.name} • {article.subject?.name}</p>
                <p className="text-[10px] text-gray-400 mt-1">Submitted: {new Date(article.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                <Link to={`/articles/${article._id}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white border border-gray-200 rounded-lg text-blue-600 font-medium text-xs">
                  <Eye className="w-4 h-4" /> View
                </Link>
                <button onClick={() => handleAction(article._id, 'approve')} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-600 text-white rounded-lg font-medium text-xs">
                  <Check className="w-4 h-4" /> Approve
                </button>
                <button onClick={() => handleAction(article._id, 'reject')} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-600 text-white rounded-lg font-medium text-xs">
                  <X className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          ))}
          {pendingArticles.length === 0 && (
            <div className="py-8 text-center text-gray-500 text-sm">No articles pending review.</div>
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 text-xs sm:text-sm uppercase tracking-wider">
                <th className="pb-4 font-semibold">Title</th>
                <th className="pb-4 font-semibold">Author</th>
                <th className="pb-4 font-semibold">Subject</th>
                <th className="pb-4 font-semibold">Date Submitted</th>
                <th className="pb-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pendingArticles.map((article: any) => (
                <tr key={article._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 font-medium text-gray-900 text-sm">{article.title}</td>
                  <td className="py-4 text-gray-600 text-sm">{article.author?.name}</td>
                  <td className="py-4 text-gray-600 text-sm">{article.subject?.name}</td>
                  <td className="py-4 text-gray-600 text-sm">{new Date(article.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 flex items-center justify-end gap-2">
                    <Link to={`/articles/${article._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                      <Eye className="w-5 h-5" />
                    </Link>
                    <button onClick={() => handleAction(article._id, 'approve')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve">
                      <Check className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleAction(article._id, 'reject')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                      <X className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pendingArticles.length === 0 && (
            <div className="py-8 text-center text-gray-500">No articles pending review.</div>
          )}
        </div>
      </div>
    </div>
  );
};
