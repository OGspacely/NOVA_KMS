import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios.ts';
import { Search, FileText, BookOpen, Filter } from 'lucide-react';

export const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'article', 'pdf'

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // In a real app, this would be a unified search endpoint.
        // For now, we'll search articles and mock some PDFs.
        const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
        
        // Mocking some PDF results for demonstration
        const mockPdfs = [
          { _id: 'pdf1', title: `Introduction to ${query}`, subject: { name: 'General' }, type: 'PDF', content: 'A comprehensive guide.' },
          { _id: 'pdf2', title: `${query} Advanced Concepts`, subject: { name: 'Science' }, type: 'PDF', content: 'Deep dive into the topic.' }
        ].filter(pdf => pdf.title.toLowerCase().includes(query.toLowerCase()));

        const formattedArticles = res.data.map((article: any) => ({ ...article, type: 'Article' }));
        
        setResults([...formattedArticles, ...mockPdfs]);
      } catch (error) {
        console.error('Error fetching search results', error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  const filteredResults = results.filter(result => {
    if (filter === 'all') return true;
    return result.type.toLowerCase() === filter;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Search className="w-8 h-8 text-blue-600" />
          Search Results for "{query}"
        </h1>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          >
            <option value="all">All Types</option>
            <option value="article">Articles</option>
            <option value="pdf">PDFs</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Searching...</div>
        ) : filteredResults.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredResults.map((result, index) => (
              <Link 
                key={result._id || index} 
                to={result.type === 'Article' ? `/articles/${result._id}` : `/resources`}
                className="p-6 flex items-start gap-4 transition-colors hover:bg-gray-50 block"
              >
                <div className="p-3 rounded-full shrink-0 bg-blue-50 text-blue-600">
                  {result.type === 'Article' ? <FileText className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{result.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                    <span className="font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{result.type}</span>
                    <span>{result.subject?.name || 'General'}</span>
                  </div>
                  <p className="text-gray-600 line-clamp-2">
                    {result.content ? result.content.replace(/<[^>]*>?/gm, '') : 'No description available.'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No results found for "{query}".</p>
            <p className="text-sm mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};
