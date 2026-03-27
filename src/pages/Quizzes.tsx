import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { CheckCircle, XCircle, Award, BrainCircuit, Plus, Settings, Users, BookOpen } from 'lucide-react';

// Shared mock quizzes (would come from DB in real implementation)
const initialQuizzes = [
  {
    id: 1,
    title: 'Basic Algebra Quiz',
    subject: 'Mathematics',
    questions: [
      { text: 'Solve for x: 2x + 5 = 15', options: ['x = 5', 'x = 10', 'x = 2', 'x = 20'], correct: 0 },
      { text: 'What is the value of 3^3?', options: ['9', '27', '81', '6'], correct: 1 },
      { text: 'Simplify: 4a + 3b - 2a + b', options: ['2a + 4b', '6a + 4b', '2a + 2b', '6a + 2b'], correct: 0 }
    ]
  },
  {
    id: 2,
    title: 'Cellular Biology Basics',
    subject: 'Integrated Science',
    questions: [
      { text: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Endoplasmic Reticulum'], correct: 1 },
      { text: 'Which organelle is responsible for protein synthesis?', options: ['Golgi apparatus', 'Lysosome', 'Ribosome', 'Vacuole'], correct: 2 }
    ]
  }
];

export const Quizzes = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<any[]>(initialQuizzes);
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  
  // Student State
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  // Teacher State
  const [showCreate, setShowCreate] = useState(false);
  const [newQuiz, setNewQuiz] = useState({ title: '', subject: 'Mathematics' });
  const [newQuestions, setNewQuestions] = useState([{ text: '', options: ['', '', '', ''], correct: 0 }]);

  // ==============================
  // STUDENT METHODS
  // ==============================
  const handleStartQuiz = (quiz: any) => {
    setActiveQuiz(quiz);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const handleAnswer = (optionIndex: number) => {
    setAnswers({ ...answers, [currentQuestion]: optionIndex });
  };

  const handleNext = () => {
    if (currentQuestion < activeQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let score = 0;
    activeQuiz.questions.forEach((q: any, index: number) => {
      if (answers[index] === q.correct) score++;
    });
    return score;
  };

  // ==============================
  // TEACHER METHODS
  // ==============================
  const handleAddQuestion = () => {
    setNewQuestions([...newQuestions, { text: '', options: ['', '', '', ''], correct: 0 }]);
  };

  const handleUpdateQuestion = (index: number, field: string, value: any) => {
    const updated = [...newQuestions];
    if (field === 'text') updated[index].text = value;
    if (field === 'correct') updated[index].correct = value;
    setNewQuestions(updated);
  };

  const handleUpdateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...newQuestions];
    updated[qIndex].options[oIndex] = value;
    setNewQuestions(updated);
  };

  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    const finalQuiz = {
      id: Date.now(),
      title: newQuiz.title,
      subject: newQuiz.subject,
      questions: newQuestions
    };
    setQuizzes([finalQuiz, ...quizzes]);
    setShowCreate(false);
    setNewQuiz({ title: '', subject: 'Mathematics' });
    setNewQuestions([{ text: '', options: ['', '', '', ''], correct: 0 }]);
  };


  // ==============================
  // RENDER TEACHER/ADMIN VIEW
  // ==============================
  if (user?.role === 'Teacher' || user?.role === 'Admin') {
    if (showCreate) {
      return (
        <div className="max-w-4xl mx-auto space-y-8">
           <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Settings className="w-8 h-8 text-purple-600" />
              Create New Quiz
            </h1>
            <button 
              onClick={() => setShowCreate(false)}
              className="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-xl transition-colors font-medium border border-gray-200"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSaveQuiz} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title</label>
                <input 
                  type="text" 
                  value={newQuiz.title}
                  onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select 
                  value={newQuiz.subject}
                  onChange={(e) => setNewQuiz({ ...newQuiz, subject: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option>Mathematics</option>
                  <option>Integrated Science</option>
                  <option>English Language</option>
                  <option>Social Studies</option>
                </select>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 space-y-8">
              <h3 className="font-bold text-lg text-gray-900">Questions</h3>
              
              {newQuestions.map((q, qIndex) => (
                <div key={qIndex} className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-purple-700">Question {qIndex + 1}</span>
                    {qIndex > 0 && (
                      <button 
                        type="button" 
                        onClick={() => setNewQuestions(newQuestions.filter((_, i) => i !== qIndex))}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <input 
                    type="text" 
                    placeholder="Enter question text..."
                    value={q.text}
                    onChange={(e) => handleUpdateQuestion(qIndex, 'text', e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {q.options.map((opt, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name={`correct-${qIndex}`}
                          checked={q.correct === oIndex}
                          onChange={() => handleUpdateQuestion(qIndex, 'correct', oIndex)}
                          className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                        />
                        <input 
                          type="text" 
                          placeholder={`Option ${oIndex + 1}`}
                          value={opt}
                          onChange={(e) => handleUpdateOption(qIndex, oIndex, e.target.value)}
                          className={`w-full bg-white border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${q.correct === oIndex ? 'border-purple-300 bg-purple-50' : 'border-gray-200'}`}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <button 
                type="button"
                onClick={handleAddQuestion}
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-all font-medium flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" /> Add Another Question
              </button>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button 
                type="submit" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-colors"
              >
                Publish Quiz
              </button>
            </div>
          </form>
        </div>
      );
    }

    // Teacher Manage Quizzes Dashboard
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BrainCircuit className="w-8 h-8 text-purple-600" />
              Manage Quizzes
            </h1>
            <p className="text-gray-500 mt-1">Create and monitor assessments for your students.</p>
          </div>
          <button 
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create New Quiz
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex gap-4 items-center">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-gray-500 font-medium">Active Quizzes</div>
              <div className="text-2xl font-bold">{quizzes.length}</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex gap-4 items-center">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-gray-500 font-medium">Total Participants</div>
              <div className="text-2xl font-bold">142</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex gap-4 items-center">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-gray-500 font-medium">Average Score</div>
              <div className="text-2xl font-bold">76%</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-bold text-lg text-gray-900">Your Published Quizzes</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="font-bold text-gray-900">{quiz.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span className="bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-md font-medium text-xs">
                      {quiz.subject}
                    </span>
                    <span>{quiz.questions.length} Questions</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">View Analytics</button>
                  <button className="text-gray-400 hover:text-gray-600"><Settings className="w-5 h-5"/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==============================
  // RENDER STUDENT VIEW (Taking Quizzes)
  // ==============================
  if (activeQuiz) {
    if (showResults) {
      const score = calculateScore();
      const percentage = (score / activeQuiz.questions.length) * 100;
      return (
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
            <Award className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Quiz Completed!</h2>
            <p className="text-xl text-gray-600 mb-8">You scored {score} out of {activeQuiz.questions.length} ({percentage.toFixed(0)}%)</p>
            
            <div className="space-y-6 text-left mb-8">
              {activeQuiz.questions.map((q: any, i: number) => (
                <div key={i} className="p-6 rounded-2xl border border-gray-100 bg-gray-50">
                  <p className="font-medium text-gray-900 mb-4">{i + 1}. {q.text}</p>
                  <div className="space-y-2">
                    {q.options.map((opt: string, optIdx: number) => {
                      const isSelected = answers[i] === optIdx;
                      const isCorrect = q.correct === optIdx;
                      let className = "p-3 rounded-xl border ";
                      if (isCorrect) className += "bg-green-50 border-green-200 text-green-700";
                      else if (isSelected && !isCorrect) className += "bg-red-50 border-red-200 text-red-700";
                      else className += "bg-white border-gray-200 text-gray-500";
                      
                      return (
                        <div key={optIdx} className={`flex items-center justify-between ${className}`}>
                          <span>{opt}</span>
                          {isCorrect && <CheckCircle className="w-5 h-5 text-green-500" />}
                          {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setActiveQuiz(null)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors"
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      );
    }

    const question = activeQuiz.questions[currentQuestion];
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">{activeQuiz.title}</h2>
            <span className="text-gray-500 font-medium">Question {currentQuestion + 1} of {activeQuiz.questions.length}</span>
          </div>
          
          <div className="mb-8">
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${((currentQuestion + 1) / activeQuiz.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <p className="text-xl font-medium text-gray-900 mb-8">{question.text}</p>
          
          <div className="space-y-4 mb-8">
            {question.options.map((opt: string, index: number) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${answers[currentQuestion] === index ? 'border-purple-600 bg-purple-50 text-purple-700 font-medium' : 'border-gray-100 hover:border-purple-200 text-gray-700'}`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <button 
              onClick={handleNext}
              disabled={answers[currentQuestion] === undefined}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              {currentQuestion === activeQuiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Student Default Quizzes View
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
          <BrainCircuit className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Practice Quizzes</h1>
          <p className="text-gray-500 mt-1">Test your knowledge, complete assigned quizzes, and track progress.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-purple-200 hover:shadow-md transition-all flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-semibold uppercase tracking-wider">
                {quiz.subject}
              </span>
              <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-semibold uppercase tracking-wider">
                {quiz.questions.length} Questions
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">{quiz.title}</h3>
            <button 
              onClick={() => handleStartQuiz(quiz)}
              className="mt-auto w-full py-3 bg-gray-50 hover:bg-purple-50 text-gray-700 hover:text-purple-700 rounded-xl font-medium transition-colors border border-gray-200 hover:border-purple-200"
            >
              Take Quiz
            </button>
          </div>
        ))}
        {quizzes.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No quizzes available at the moment. Check back later!
          </div>
        )}
      </div>
    </div>
  );
};
