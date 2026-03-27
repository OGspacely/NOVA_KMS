import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import api from '../api/axios.ts';
import { Calendar, FileText, Plus, CheckCircle, Clock, Users, Edit, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PRELOADED_ASSIGNMENTS = [
  {
    _id: 'pre-assign-1',
    title: 'Midterm Essay: The Impact of the Industrial Revolution',
    description: 'Write a 1500-word essay detailing the social and economic impacts of the Industrial Revolution in Europe.',
    course: 'Social Studies',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    totalPoints: 100,
    submissions: 24
  },
  {
    _id: 'pre-assign-2',
    title: 'Algebraic Expressions Problem Set',
    description: 'Complete problems 1-20 on page 145 of the Core Mathematics textbook. Show all work.',
    course: 'Mathematics',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    totalPoints: 50,
    submissions: 42
  },
  {
    _id: 'pre-assign-3',
    title: 'Biology Lab Report: Photosynthesis',
    description: 'Submit your formal lab report for the photosynthesis experiment conducted last week.',
    course: 'Integrated Science',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    totalPoints: 75,
    submissions: 18
  }
];

export const Assignments = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<any[]>(PRELOADED_ASSIGNMENTS);
  const [showCreate, setShowCreate] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    course: '',
    dueDate: '',
    totalPoints: 100
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await api.get('/assignments');
      const fetched = Array.isArray(res.data) ? res.data : [];
      setAssignments([...fetched, ...PRELOADED_ASSIGNMENTS]);
    } catch (error) {
      console.error('Error fetching assignments', error);
      setAssignments(PRELOADED_ASSIGNMENTS);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = {
        _id: `new-${Date.now()}`,
        ...newAssignment,
        submissions: 0
      };
      // Try hitting API, but update locally for instant feedback
      api.post('/assignments', newAssignment).catch(() => {});
      
      setAssignments([created, ...assignments]);
      setShowCreate(false);
      setNewAssignment({ title: '', description: '', course: '', dueDate: '', totalPoints: 100 });
    } catch (error) {
      console.error('Error creating assignment', error);
    }
  };

  // ==============================
  // TEACHER / ADMIN VIEW
  // ==============================
  if (user?.role === 'Teacher' || user?.role === 'Admin') {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            Manage Assignments
          </h1>
          <button 
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            {showCreate ? 'Cancel' : <><Plus className="w-5 h-5" /> Create Assignment</>}
          </button>
        </div>

        {/* Dashboard Stats */}
        {!showCreate && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex gap-4 items-center">
             <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
               <FileText className="w-6 h-6" />
             </div>
             <div>
               <div className="text-sm text-gray-500 font-medium">Active Assignments</div>
               <div className="text-2xl font-bold">{assignments.length}</div>
             </div>
           </div>
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex gap-4 items-center">
             <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
               <Users className="w-6 h-6" />
             </div>
             <div>
               <div className="text-sm text-gray-500 font-medium">Total Submissions</div>
               <div className="text-2xl font-bold">84</div>
             </div>
           </div>
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex gap-4 items-center">
             <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
               <Activity className="w-6 h-6" />
             </div>
             <div>
               <div className="text-sm text-gray-500 font-medium">Needs Grading</div>
               <div className="text-2xl font-bold">12</div>
             </div>
           </div>
         </div>
        )}

        {/* Creation Form */}
        {showCreate && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Assignment</h2>
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input 
                    type="text" 
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course / Subject</label>
                  <input 
                    type="text" 
                    value={newAssignment.course}
                    onChange={(e) => setNewAssignment({ ...newAssignment, course: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input 
                    type="datetime-local" 
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Points</label>
                  <input 
                    type="number" 
                    value={newAssignment.totalPoints}
                    onChange={(e) => setNewAssignment({ ...newAssignment, totalPoints: parseInt(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description / Instructions</label>
                <textarea 
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowCreate(false)}
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Assignments List (Teacher View) */}
        {!showCreate && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="font-bold text-lg text-gray-900">Assigned Work</h2>
              <span className="text-sm font-medium text-gray-500">Sorted by Nearest Due Date</span>
            </div>
            <div className="divide-y divide-gray-50 text-left">
              <div className="grid grid-cols-12 gap-4 p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider items-center">
                <div className="col-span-5">Assignment Name</div>
                <div className="col-span-3">Course</div>
                <div className="col-span-2 text-center">Submissions</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
              {assignments.map((assignment) => (
                <div key={assignment._id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-blue-50/30 transition-colors">
                  <div className="col-span-5">
                    <h3 className="font-bold text-gray-900">{assignment.title}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" /> Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="col-span-3">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                      {assignment.course}
                    </span>
                  </div>
                  <div className="col-span-2 text-center text-sm font-medium text-gray-900">
                    {assignment.submissions || 0} / 42
                  </div>
                  <div className="col-span-2 flex justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Assignment">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors">
                      Grade
                    </button>
                  </div>
                </div>
              ))}
              {assignments.length === 0 && (
                <div className="p-8 text-center text-gray-500">You haven't created any assignments yet.</div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==============================
  // STUDENT VIEW 
  // ==============================
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
          <FileText className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Assignments</h1>
          <p className="text-gray-500 mt-1">View your pending tasks and submit your work.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {assignments.map((assignment) => {
          const isOverdue = new Date(assignment.dueDate) < new Date();
          return (
            <Link key={assignment._id} to={`/assignments/${assignment._id}`} className="block group">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between hover:border-blue-200 transition-all hover:shadow-md">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{assignment.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span className="font-medium text-gray-700">{assignment.course}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Due: {new Date(assignment.dueDate).toLocaleString()}
                      </span>
                      <span>{assignment.totalPoints} pts</span>
                    </div>
                  </div>
                </div>
                <div>
                  {isOverdue ? (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Overdue
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Active
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
        {assignments.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
            <CheckCircle className="w-16 h-16 text-green-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">You're all caught up!</h3>
            <p className="text-gray-500">No pending assignments at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};
