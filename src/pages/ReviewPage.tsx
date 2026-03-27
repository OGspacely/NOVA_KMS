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
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Review Queue</h1>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
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
                  <td className="py-4 font-medium text-gray-900">{article.title}</td>
                  <td className="py-4 text-gray-600">{article.author?.name}</td>
                  <td className="py-4 text-gray-600">{article.subject?.name}</td>
                  <td className="py-4 text-gray-600">{new Date(article.createdAt).toLocaleDateString()}</td>
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
              {pendingArticles.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No articles pending review.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
