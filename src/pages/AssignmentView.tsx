import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { FileText, Calendar, Upload, CheckCircle, ArrowLeft, Clock, X } from 'lucide-react';
import { PRELOADED_ASSIGNMENTS } from './Assignments.tsx';

export const AssignmentView = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [assignment, setAssignment] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [mySubmission, setMySubmission] = useState<any>(null);
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);

  // Grading state
  const [gradingSubId, setGradingSubId] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchData();
  }, [id, user]);

  const fetchData = async () => {
    if (!id) return;

    if (id.startsWith('pre-assign-')) {
      const preloaded = PRELOADED_ASSIGNMENTS.find(a => a._id === id);
      if (preloaded) {
        setAssignment(preloaded);
        setSubmissions([]);
        setMySubmission(null);
        setLoading(false);
        return;
      }
    }

    try {
      const res = await api.get(`/assignments/${id}`);
      setAssignment(res.data);

      if (user?.role === 'Teacher' || user?.role === 'Admin') {
        const subsRes = await api.get(`/assignments/${id}/submissions`);
        setSubmissions(Array.isArray(subsRes.data) ? subsRes.data : []);
      } else if (user?.role === 'Student') {
        // Find my submission (simplified for demo, usually an endpoint for /my-submission)
        const subsRes = await api.get(`/assignments/${id}/submissions`);
        const subsData = Array.isArray(subsRes.data) ? subsRes.data : [];
        const mine = subsData.find((s: any) => s.student._id === user._id);
        if (mine) setMySubmission(mine);
      }
    } catch (error) {
      console.error('Error fetching assignment data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id?.startsWith('pre-assign-')) {
        // Mock submission for preloaded assignments
        setMySubmission({
          _id: 'mock-sub-' + Date.now(),
          assignment: id,
          student: user,
          content,
          attachments: files.map(f => ({ filename: f.name, url: '#' })),
          status: 'Submitted',
          createdAt: new Date().toISOString()
        });
        return;
      }

      const formData = new FormData();
      formData.append('content', content);
      files.forEach(file => {
        formData.append('files', file);
      });

      await api.post(`/assignments/${id}/submit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchData();
    } catch (error) {
      console.error('Error submitting assignment', error);
    }
  };

  const handleGrade = async (subId: string) => {
    try {
      await api.put(`/assignments/submissions/${subId}/grade`, { score, feedback });
      setGradingSubId(null);
      fetchData();
    } catch (error) {
      console.error('Error grading submission', error);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading assignment...</div>;
  if (!assignment) return <div className="p-8 text-center text-gray-500">Assignment not found</div>;

  const isOverdue = new Date(assignment.dueDate) < new Date();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Link to="/assignments" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Assignments
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{assignment.title}</h1>
          <div className="flex items-center gap-4">
            <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium">
              {assignment.totalPoints} Points
            </span>
            {isOverdue ? (
              <span className="px-4 py-2 bg-red-100 text-red-700 rounded-xl font-medium flex items-center gap-2">
                <Clock className="w-5 h-5" /> Overdue
              </span>
            ) : (
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-xl font-medium flex items-center gap-2">
                <Calendar className="w-5 h-5" /> Due: {new Date(assignment.dueDate).toLocaleString()}
              </span>
            )}
          </div>
        </div>
        
        <div className="prose max-w-none text-gray-700 mb-8 whitespace-pre-wrap">
          {assignment.description}
        </div>

        {assignment.attachments?.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Attached Materials</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {assignment.attachments.map((att: any, idx: number) => (
                <a key={idx} href={att.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <span className="font-medium text-gray-900 truncate">{att.filename}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {user?.role === 'Student' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Submission</h2>
          
          {mySubmission ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
                <div className="flex items-center gap-3 font-medium">
                  <CheckCircle className="w-6 h-6" />
                  Submitted on {new Date(mySubmission.createdAt).toLocaleString()}
                </div>
                <span className="font-bold">{mySubmission.status}</span>
              </div>

              {mySubmission.status === 'Graded' && (
                <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-blue-900">Grade</h3>
                    <span className="text-2xl font-black text-blue-700">{mySubmission.score} / {assignment.totalPoints}</span>
                  </div>
                  {mySubmission.feedback && (
                    <div>
                      <h4 className="font-medium text-blue-800 mb-1">Feedback:</h4>
                      <p className="text-blue-900">{mySubmission.feedback}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                {mySubmission.content}
              </div>

              {mySubmission.attachments?.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mySubmission.attachments.map((att: any, idx: number) => (
                    <a key={idx} href={att.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
                      <FileText className="w-6 h-6 text-blue-600" />
                      <span className="font-medium text-gray-900 truncate">{att.filename}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Submission Text</label>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                  placeholder="Type your answer or comments here..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">Click to upload files</p>
                  <input 
                    type="file" 
                    multiple 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </div>
                
                {files.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {files.map((file, index) => (
                      <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                        <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 p-1">
                          <X className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={isOverdue}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isOverdue ? 'Submission Closed' : 'Submit Assignment'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {(user?.role === 'Teacher' || user?.role === 'Admin') && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Submissions ({submissions.length})</h2>
          
          <div className="space-y-4">
            {submissions.map((sub) => (
              <div key={sub._id} className="border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {sub.student?.name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{sub.student?.name}</div>
                      <div className="text-sm text-gray-500">Submitted: {new Date(sub.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                  <div>
                    {sub.status === 'Graded' ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold uppercase tracking-wider">
                        Graded: {sub.score}/{assignment.totalPoints}
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold uppercase tracking-wider">
                        Needs Grading
                      </span>
                    )}
                  </div>
                </div>

                <div className="prose max-w-none text-gray-700 mb-4 whitespace-pre-wrap bg-gray-50 p-4 rounded-xl">
                  {sub.content || 'No text provided.'}
                </div>

                {sub.attachments?.length > 0 && (
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {sub.attachments.map((att: any, idx: number) => (
                      <a key={idx} href={att.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-300 text-sm font-medium text-blue-600">
                        <FileText className="w-4 h-4" /> {att.filename}
                      </a>
                    ))}
                  </div>
                )}

                {gradingSubId === sub._id ? (
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <h4 className="font-bold text-blue-900 mb-4">Grade Submission</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-blue-800 mb-1">Score (out of {assignment.totalPoints})</label>
                        <input 
                          type="number" 
                          value={score}
                          onChange={(e) => setScore(Number(e.target.value))}
                          className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-blue-800 mb-1">Feedback</label>
                        <input 
                          type="text" 
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setGradingSubId(null)} className="px-4 py-2 text-blue-700 hover:bg-blue-100 rounded-lg font-medium transition-colors">Cancel</button>
                      <button onClick={() => handleGrade(sub._id)} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors">Save Grade</button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={() => {
                        setGradingSubId(sub._id);
                        setScore(sub.score || 0);
                        setFeedback(sub.feedback || '');
                      }}
                      className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                    >
                      {sub.status === 'Graded' ? 'Edit Grade' : 'Grade Submission'}
                    </button>
                  </div>
                )}
              </div>
            ))}
            {submissions.length === 0 && (
              <div className="text-center py-8 text-gray-500">No submissions yet.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
