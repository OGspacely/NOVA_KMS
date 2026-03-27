import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.ts';
import { Search, Filter, BookOpen } from 'lucide-react';

export const BrowseArticles = () => {
  const [articles, setArticles] = useState([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const subjectsRes = await api.get('/search/subjects');
        setSubjects(Array.isArray(subjectsRes.data) ? subjectsRes.data : []);
      } catch (error) {
        console.error('Error fetching subjects', error);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [selectedSubject]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      let url = `/search?q=${searchQuery}`;
      if (selectedSubject) {
        url += `&subject=${selectedSubject}`;
      }
      const res = await api.get(url);
      setArticles(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error searching', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
          
          <form onSubmit={handleSearch} className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search articles, topics..." 
                className="w-full bg-gray-50 text-gray-900 pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors">
              Search
            </button>
          </form>
        </div>

        <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
          <button 
            onClick={() => setSelectedSubject('')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${!selectedSubject ? 'bg-blue-50 text-blue-700' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            <Filter className="w-4 h-4" /> All Subjects
          </button>
          {subjects.map(subject => (
            <button 
              key={subject._id}
              onClick={() => setSelectedSubject(subject._id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${selectedSubject === subject._id ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {subject.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article: any) => (
            <Link key={article._id} to={`/articles/${article._id}`} className="group block h-full">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 h-full flex flex-col hover:border-blue-200 hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-semibold uppercase tracking-wider">
                    {article.subject?.name || 'Subject'}
                  </span>
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-semibold uppercase tracking-wider">
                    Grade {article.gradeLevel}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1">
                  {article.content.replace(/<[^>]*>?/gm, '')}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                      {article.author?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{article.author?.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(article.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {articles.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
};
