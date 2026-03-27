import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import api from '../api/axios.ts';
import { Calendar, FileText, Plus, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PRELOADED_ASSIGNMENTS = [
  {
    _id: 'pre-assign-1',
    title: 'Midterm Essay: The Impact of the Industrial Revolution',
    description: 'Write a 1500-word essay detailing the social and economic impacts of the Industrial Revolution in Europe.',
    course: 'Social Studies',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    totalPoints: 100
  },
  {
    _id: 'pre-assign-2',
    title: 'Algebraic Expressions Problem Set',
    description: 'Complete problems 1-20 on page 145 of the Core Mathematics textbook. Show all work.',
    course: 'Mathematics',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    totalPoints: 50
  },
  {
    _id: 'pre-assign-3',
    title: 'Biology Lab Report: Photosynthesis',
    description: 'Submit your formal lab report for the photosynthesis experiment conducted last week.',
    course: 'Integrated Science',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    totalPoints: 75
  },
  {
    _id: 'pre-assign-4',
    title: 'ICT Practical: Spreadsheet Functions',
    description: 'Create a spreadsheet that uses VLOOKUP, IF statements, and Pivot Tables to analyze the provided dataset.',
    course: 'Information and Communication Technology (ICT)',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    totalPoints: 100
  },
  {
    _id: 'pre-assign-5',
    title: 'Literature Review: Things Fall Apart',
    description: 'Read Chinua Achebe\'s "Things Fall Apart" and write a comparative analysis of the main characters.',
    course: 'English Language',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    totalPoints: 100
  },
  {
    _id: 'pre-assign-6',
    title: 'Cultural Heritage Project',
    description: 'Research and present on the significance of traditional festivals in your local community.',
    course: 'Ghanaian Language and Culture',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    totalPoints: 80
  },
  {
    _id: 'pre-assign-7',
    title: 'Design Process Portfolio',
    description: 'Submit your portfolio documenting the design process for your term project, including sketches and material selection.',
    course: 'Design and Technology',
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    totalPoints: 120
  },
  {
    _id: 'pre-assign-8',
    title: 'French Oral Presentation',
    description: 'Prepare a 5-minute oral presentation in French about your daily routine.',
    course: 'French',
    dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    totalPoints: 50
  },
  {
    _id: 'pre-assign-9',
    title: 'Moral Dilemmas Essay',
    description: 'Analyze a contemporary moral dilemma using principles discussed in class.',
    course: 'Religious and Moral Education (RME)',
    dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    totalPoints: 60
  },
  {
    _id: 'pre-assign-10',
    title: 'Fitness Tracking Log',
    description: 'Submit your 2-week fitness tracking log including cardiovascular and strength training activities.',
    course: 'Physical Education and Health (PEH)',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    totalPoints: 40
  },
  {
    _id: 'pre-assign-11',
    title: 'Geometry: Properties of Triangles',
    description: 'Solve the geometry problems on page 210, focusing on the Pythagorean theorem and similar triangles.',
    course: 'Mathematics',
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    totalPoints: 60
  },
  {
    _id: 'pre-assign-12',
    title: 'Science Project: Water Purification',
    description: 'Design and build a simple water filtration system using locally available materials. Document your process.',
    course: 'Integrated Science',
    dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    totalPoints: 150
  },
  {
    _id: 'pre-assign-13',
    title: 'Essay: The Role of the Media in Democracy',
    description: 'Write a 1000-word essay discussing how the media influences democratic processes in Ghana.',
    course: 'Social Studies',
    dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
    totalPoints: 100
  },
  {
    _id: 'pre-assign-14',
    title: 'Programming Basics: Python Variables',
    description: 'Complete the online Python exercises on variables, data types, and basic input/output operations.',
    course: 'Information and Communication Technology (ICT)',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    totalPoints: 50
  },
  {
    _id: 'pre-assign-15',
    title: 'Poetry Analysis: "The Weaver Bird"',
    description: 'Analyze the themes and literary devices used in Kofi Awoonor\'s poem "The Weaver Bird".',
    course: 'English Language',
    dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    totalPoints: 80
  },
  {
    _id: 'pre-assign-16',
    title: 'Proverbs and their Meanings',
    description: 'Collect 10 local proverbs, translate them, and explain their moral or philosophical meanings.',
    course: 'Ghanaian Language and Culture',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    totalPoints: 70
  },
  {
    _id: 'pre-assign-17',
    title: 'Technical Drawing: Orthographic Projections',
    description: 'Complete the orthographic projection drawings for the given 3D objects. Ensure accurate measurements.',
    course: 'Design and Technology',
    dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    totalPoints: 100
  },
  {
    _id: 'pre-assign-18',
    title: 'French Vocabulary Quiz Preparation',
    description: 'Study the vocabulary list for Chapter 3 (Food and Dining) in preparation for the upcoming quiz.',
    course: 'French',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    totalPoints: 20
  },
  {
    _id: 'pre-assign-19',
    title: 'Comparative Religion Study',
    description: 'Compare and contrast the core beliefs of Christianity, Islam, and Traditional African Religion.',
    course: 'Religious and Moral Education (RME)',
    dueDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString(),
    totalPoints: 90
  },
  {
    _id: 'pre-assign-20',
    title: 'Nutrition and Diet Plan',
    description: 'Create a balanced one-week diet plan based on locally available Ghanaian foods, calculating caloric intake.',
    course: 'Physical Education and Health (PEH)',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    totalPoints: 80
  }
];

export const Assignments = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
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
      await api.post('/assignments', newAssignment);
      setShowCreate(false);
      setNewAssignment({ title: '', description: '', course: '', dueDate: '', totalPoints: 100 });
      fetchAssignments();
    } catch (error) {
      console.error('Error creating assignment', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-600" />
          Assignments & Assessments
        </h1>
        {(user?.role === 'Teacher' || user?.role === 'Admin') && (
          <button 
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Assignment
          </button>
        )}
      </div>

      {showCreate && (user?.role === 'Teacher' || user?.role === 'Admin') && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">New Assignment</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
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
            <div className="flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setShowCreate(false)}
                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Publish Assignment
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {assignments.map((assignment) => {
          const isOverdue = new Date(assignment.dueDate) < new Date();
          return (
            <Link key={assignment._id} to={`/assignments/${assignment._id}`} className="block group">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between hover:border-blue-200 transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
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
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No assignments yet</h3>
            <p className="text-gray-500">Assignments created by teachers will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
