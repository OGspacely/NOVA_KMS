import React, { useEffect, useState } from 'react';
import api from '../../api/axios.ts';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

export const TaxonomyManager = ({ onBack }: { onBack: () => void }) => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [newSubject, setNewSubject] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    fetchTaxonomy();
  }, []);

  const fetchTaxonomy = async () => {
    try {
      const [subRes, topRes] = await Promise.all([
        api.get('/search/subjects'),
        api.get('/search/topics')
      ]);
      setSubjects(Array.isArray(subRes.data) ? subRes.data : []);
      setTopics(Array.isArray(topRes.data) ? topRes.data : []);
    } catch (error) {
      console.error('Error fetching taxonomy', error);
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject) return;
    try {
      // Assuming we have an endpoint for this, if not, we'll mock it or add it later
      await api.post('/admin/subjects', { name: newSubject });
      setNewSubject('');
      fetchTaxonomy();
    } catch (error) {
      console.error('Error adding subject', error);
      alert('Failed to add subject. Ensure backend route exists.');
    }
  };

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic || !selectedSubject) return;
    try {
      await api.post('/admin/topics', { name: newTopic, subject: selectedSubject });
      setNewTopic('');
      fetchTaxonomy();
    } catch (error) {
      console.error('Error adding topic', error);
      alert('Failed to add topic. Ensure backend route exists.');
    }
  };

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>
      <h2 className="text-2xl font-bold text-gray-900">Manage Taxonomy</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Subjects */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Subjects</h3>
          <form onSubmit={handleAddSubject} className="flex gap-2 mb-6">
            <input 
              type="text" 
              placeholder="New Subject Name" 
              className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500"
              value={newSubject}
              onChange={e => setNewSubject(e.target.value)}
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add
            </button>
          </form>
          <ul className="space-y-2 max-h-96 overflow-y-auto">
            {subjects.map(sub => (
              <li key={sub._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="font-medium text-gray-700">{sub.name}</span>
                <button className="text-red-500 hover:text-red-700 p-1"><Trash2 className="w-4 h-4" /></button>
              </li>
            ))}
          </ul>
        </div>

        {/* Topics */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Topics</h3>
          <form onSubmit={handleAddTopic} className="flex flex-col gap-2 mb-6">
            <select 
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-white"
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
            >
              <option value="">Select Subject...</option>
              {subjects.map(sub => (
                <option key={sub._id} value={sub._id}>{sub.name}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="New Topic Name" 
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500"
                value={newTopic}
                onChange={e => setNewTopic(e.target.value)}
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          </form>
          <ul className="space-y-2 max-h-96 overflow-y-auto">
            {topics.map(top => (
              <li key={top._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <span className="font-medium text-gray-700 block">{top.name}</span>
                  <span className="text-xs text-gray-500">Subject: {top.subject?.name || 'Unknown'}</span>
                </div>
                <button className="text-red-500 hover:text-red-700 p-1"><Trash2 className="w-4 h-4" /></button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
