import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { MessageSquare, ThumbsUp, Bookmark, Calendar, User, Tag, Paperclip, Download, FileText, Star, Youtube, PlayCircle, Check, XCircle } from 'lucide-react';

export const ArticleView = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [article, setArticle] = useState<any>(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/articles/${id}`);
        setArticle(res.data);
        const commentsRes = await api.get(`/comments/${id}`);
        setComments(Array.isArray(commentsRes.data) ? commentsRes.data : []);
      } catch (error) {
        console.error('Error fetching article', error);
      }
    };
    fetchArticle();
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await api.post('/comments', { content: newComment, articleId: id });
      setComments([res.data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment', error);
    }
  };

  const handleRate = async (value: number) => {
    try {
      const res = await api.post(`/articles/${id}/rate`, { value });
      setArticle(res.data);
    } catch (error) {
      console.error('Error rating article', error);
    }
  };

  const handleReviewAction = async (action: 'approve' | 'reject') => {
    try {
      await api.put(`/articles/${id}/${action}`);
      setArticle({ ...article, status: action === 'approve' ? 'Approved' : 'Rejected' });
      alert(`Article successfully ${action}d!`);
    } catch (error) {
      console.error(`Error ${action}ing article`, error);
      alert(`Error updating article status.`);
    }
  };

  if (!article) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  const userRating = article.ratings?.find((r: any) => r.user === user?._id)?.value || 0;

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wider">
            {article.subject?.name || 'Subject'}
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold uppercase tracking-wider">
            {article.topic?.name || 'Topic'}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold uppercase tracking-wider">
            Grade {article.gradeLevel}
          </span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">{article.title}</h1>
        
        {article.status === 'Pending' && (user?.role === 'Admin' || user?.role === 'Teacher') && (
          <div className="mb-8 p-6 bg-yellow-50 rounded-2xl border border-yellow-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-yellow-800 text-lg">Pending Review</h3>
              <p className="text-yellow-700 mt-1 text-sm">Please review the content and attachments below before approving.</p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button onClick={() => handleReviewAction('approve')} className="flex-1 sm:flex-none px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors flex justify-center items-center gap-2">
                <Check className="w-5 h-5" /> Approve
              </button>
              <button onClick={() => handleReviewAction('reject')} className="flex-1 sm:flex-none px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors flex justify-center items-center gap-2">
                <XCircle className="w-5 h-5" /> Reject
              </button>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between py-6 border-y border-gray-100 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
              {article.author?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="font-medium text-gray-900">{article.author?.name || 'Unknown Author'}</div>
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(article.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 mr-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star} 
                  onClick={() => handleRate(star)}
                  className={`p-1 transition-colors ${star <= userRating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'}`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
              <span className="text-sm text-gray-500 ml-2">({article.rating?.toFixed(1) || 0})</span>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700 font-medium">
              <ThumbsUp className="w-5 h-5" />
              <span>{article.likes?.length || 0}</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700 font-medium">
              <Bookmark className="w-5 h-5" />
              <span>Save</span>
            </button>
          </div>
        </div>

        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: article.content }} />

        {article.youtubeLinks && article.youtubeLinks.length > 0 && (
          <div className="mb-8 p-6 bg-red-50 rounded-2xl border border-red-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Youtube className="w-6 h-6 text-red-600" /> Video Resources
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {article.youtubeLinks.map((link: any, idx: number) => {
                const videoId = getYoutubeId(link.url);
                return (
                  <a 
                    key={idx} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group block bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-red-300 hover:shadow-md transition-all"
                  >
                    <div className="relative aspect-video bg-gray-100">
                      {videoId ? (
                        <img 
                          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} 
                          alt={link.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <Youtube className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <PlayCircle className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 truncate" title={link.title}>{link.title}</h4>
                      <p className="text-sm text-gray-500 truncate mt-1">{link.url}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {article.attachments && article.attachments.length > 0 && (
          <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Paperclip className="w-5 h-5 text-gray-500" /> Attachments
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {article.attachments.map((attachment: any, idx: number) => (
                <a 
                  key={idx} 
                  href={attachment.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-medium text-gray-900 truncate">{attachment.name}</p>
                      <p className="text-xs text-gray-500 uppercase">{attachment.type.split('/')[1]}</p>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}

        {article.tags?.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-6 border-t border-gray-100">
            <Tag className="w-5 h-5 text-gray-400 mr-2" />
            {article.tags.map((tag: string, idx: number) => (
              <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          Discussion ({comments.length})
        </h3>
        
        <form onSubmit={handleCommentSubmit} className="mb-8">
          <textarea
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
            rows={3}
            placeholder="Add to the discussion..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <div className="flex justify-end mt-3">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors">
              Post Comment
            </button>
          </div>
        </form>

        <div className="space-y-6">
          {comments.map((comment: any) => (
            <div key={comment._id} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center font-bold text-gray-600">
                {comment.author?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 bg-gray-50 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{comment.author?.name || 'Unknown'}</span>
                  <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
