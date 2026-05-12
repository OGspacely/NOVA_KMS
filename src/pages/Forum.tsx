import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.ts';
import { MessageCircle, ThumbsUp, Plus, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

export const Forum = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<any[]>([]);
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await api.get('/forum/questions');
      setQuestions(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching questions', error);
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/forum/questions', newQuestion);
      setNewQuestion({ title: '', content: '' });
      setShowNewQuestion(false);
      fetchQuestions();
    } catch (error) {
      console.error('Error creating question', error);
    }
  };

  const handleUpvote = async (id: string) => {
    try {
      await api.post(`/forum/questions/${id}/upvote`);
      fetchQuestions();
    } catch (error) {
      console.error('Error upvoting', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
          <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          Q&A Forum
        </h1>
        <button 
          onClick={() => setShowNewQuestion(!showNewQuestion)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-colors text-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          Ask Question
        </button>
      </div>

      {showNewQuestion && (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Ask a New Question</h2>
          <form onSubmit={handleCreateQuestion} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input 
                type="text" 
                value={newQuestion.title}
                onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                placeholder="What's your question? Be specific."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Details</label>
              <textarea 
                value={newQuestion.content}
                onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                placeholder="Provide all the details someone would need to answer your question..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setShowNewQuestion(false)}
                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Post Question
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q._id} className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 flex gap-3 sm:gap-6 hover:border-blue-200 transition-colors">
            <div className="flex flex-col items-center gap-1 sm:gap-2 shrink-0">
              <button 
                onClick={() => handleUpvote(q._id)}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors ${q.upvotes?.includes(user?._id) ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <ThumbsUp className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
              <span className="font-bold text-xs sm:text-base text-gray-700">{q.upvotes?.length || 0}</span>
            </div>
            <div className="flex-1">
              <Link to={`/forum/${q._id}`} className="text-base sm:text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-1 sm:mb-2">
                {q.title}
              </Link>
              <p className="text-gray-600 line-clamp-2 mb-3 sm:mb-4 text-sm">{q.content}</p>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                    {q.author?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="font-medium text-gray-700">{q.author?.name}</span>
                  <span>•</span>
                  <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>{q.answersCount} answers</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {questions.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No questions yet</h3>
            <p className="text-gray-500">Be the first to ask a question!</p>
          </div>
        )}
      </div>
    </div>
  );
};
