import React, { useEffect, useState } from 'react';
import api from '../../api/axios.ts';
import { ArrowLeft, FileText, CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';

export const ArticleList = ({ onBack, initialStatus }: { onBack: () => void, initialStatus?: string }) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus || 'All');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const url = statusFilter === 'All' ? '/admin/articles' : `/admin/articles?status=${statusFilter}`;
        const res = await api.get(url);
        setArticles(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('Error fetching articles', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [statusFilter]);

  const handleDeleteArticle = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) return;
    try {
      await api.delete(`/articles/${id}`);
      setArticles(articles.filter(a => a._id !== id));
    } catch (error) {
      console.error('Error deleting article', error);
      alert('Failed to delete article');
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Pending': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'Rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <div className="flex items-center gap-2">
          {['All', 'Approved', 'Pending', 'Draft', 'Rejected'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                statusFilter === status 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900">Manage Articles {statusFilter !== 'All' && `- ${statusFilter}`}</h2>
      
      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading articles...</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {articles.map((article) => (
                  <tr key={article._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate" title={article.title}>
                      {article.title}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{article.author?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-gray-500">{article.subject?.name || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(article.status)}
                        <span className="font-medium text-gray-700">{article.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeleteArticle(article._id)}
                        className="text-red-600 hover:text-red-800 p-2"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {articles.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No articles found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
