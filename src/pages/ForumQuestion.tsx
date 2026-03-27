import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { MessageCircle, ThumbsUp, User as UserIcon, ArrowLeft, CheckCircle } from 'lucide-react';

export const ForumQuestion = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [question, setQuestion] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestionData();
  }, [id]);

  const fetchQuestionData = async () => {
    try {
      const res = await api.get(`/forum/questions/${id}`);
      setQuestion(res.data.question);
      setAnswers(Array.isArray(res.data.answers) ? res.data.answers : []);
    } catch (error) {
      console.error('Error fetching question', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;
    try {
      await api.post(`/forum/questions/${id}/answers`, { content: newAnswer });
      setNewAnswer('');
      fetchQuestionData();
    } catch (error) {
      console.error('Error posting answer', error);
    }
  };

  const handleUpvoteQuestion = async () => {
    try {
      await api.post(`/forum/questions/${id}/upvote`);
      fetchQuestionData();
    } catch (error) {
      console.error('Error upvoting question', error);
    }
  };

  const handleUpvoteAnswer = async (answerId: string) => {
    try {
      await api.post(`/forum/answers/${answerId}/upvote`);
      fetchQuestionData();
    } catch (error) {
      console.error('Error upvoting answer', error);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading question...</div>;
  if (!question) return <div className="p-8 text-center text-gray-500">Question not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link to="/forum" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Forum
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex gap-6">
          <div className="flex flex-col items-center gap-2">
            <button 
              onClick={handleUpvoteQuestion}
              className={`p-2 rounded-lg transition-colors ${question.upvotes?.includes(user?._id) ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-500'}`}
            >
              <ThumbsUp className="w-8 h-8" />
            </button>
            <span className="font-bold text-gray-700 text-xl">{question.upvotes?.length || 0}</span>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{question.title}</h1>
            <div className="prose max-w-none text-gray-700 mb-6 whitespace-pre-wrap">
              {question.content}
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {question.author?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{question.author?.name}</div>
                  <div className="text-xs">{new Date(question.createdAt).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-blue-600" />
          {answers.length} Answers
        </h2>

        {answers.map((answer) => (
          <div key={answer._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex gap-6">
            <div className="flex flex-col items-center gap-2">
              <button 
                onClick={() => handleUpvoteAnswer(answer._id)}
                className={`p-2 rounded-lg transition-colors ${answer.upvotes?.includes(user?._id) ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <ThumbsUp className="w-6 h-6" />
              </button>
              <span className="font-bold text-gray-700">{answer.upvotes?.length || 0}</span>
              {answer.isAccepted && (
                <CheckCircle className="w-6 h-6 text-green-500 mt-2" />
              )}
            </div>
            <div className="flex-1">
              <div className="prose max-w-none text-gray-700 mb-4 whitespace-pre-wrap">
                {answer.content}
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold">
                    {answer.author?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{answer.author?.name}</div>
                    <div className="text-xs">{new Date(answer.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Your Answer</h3>
          <form onSubmit={handlePostAnswer}>
            <textarea 
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Write your answer here..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 mb-4"
              required
            />
            <div className="flex justify-end">
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Post Answer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
