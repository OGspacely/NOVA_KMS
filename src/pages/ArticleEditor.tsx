import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from 'react-simple-wysiwyg';
import api from '../api/axios.ts';
import { Upload, X, Youtube, Plus, FileText, Video } from 'lucide-react';

export const ArticleEditor = () => {
  const [creationType, setCreationType] = useState<'article' | 'video'>('article');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [gradeLevel, setGradeLevel] = useState('8');
  const [tags, setTags] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [youtubeLinks, setYoutubeLinks] = useState<{title: string, url: string}[]>([]);
  const [newYoutubeTitle, setNewYoutubeTitle] = useState('');
  const [newYoutubeUrl, setNewYoutubeUrl] = useState('');
  const [subjects, setSubjects] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTaxonomy = async () => {
      try {
        const [subRes, topRes] = await Promise.all([
          api.get('/search/subjects'),
          api.get('/search/topics')
        ]);
        setSubjects(Array.isArray(subRes.data) ? subRes.data : []);
        setTopics(Array.isArray(topRes.data) ? topRes.data : []);
        
        if (Array.isArray(subRes.data) && subRes.data.length > 0) {
          setSubject(subRes.data[0]._id);
        }
        if (Array.isArray(topRes.data) && topRes.data.length > 0) {
          setTopic(topRes.data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching taxonomy', error);
      }
    };
    fetchTaxonomy();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addYoutubeLink = () => {
    if (newYoutubeTitle && newYoutubeUrl) {
      setYoutubeLinks(prev => [...prev, { title: newYoutubeTitle, url: newYoutubeUrl }]);
      setNewYoutubeTitle('');
      setNewYoutubeUrl('');
    }
  };

  const removeYoutubeLink = (index: number) => {
    setYoutubeLinks(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent, submitForReview: boolean) => {
    e.preventDefault();
    if (!title || !subject) {
      alert('Please fill in all required fields (Title, Subject).');
      return;
    }
    if (creationType === 'article' && !content) {
      alert('Please provide content for the article.');
      return;
    }
    if (creationType === 'video' && youtubeLinks.length === 0) {
      alert('Please add at least one YouTube video link.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', creationType === 'article' ? content : 'Video Content');
      formData.append('subject', subject);
      if (topic) {
        formData.append('topic', topic);
      }
      formData.append('gradeLevel', gradeLevel);
      formData.append('tags', tags);
      formData.append('submitForReview', submitForReview.toString());
      formData.append('youtubeLinks', JSON.stringify(youtubeLinks));
      
      if (creationType === 'article') {
        files.forEach(file => {
          formData.append('files', file);
        });
      }

      await api.post('/articles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert(submitForReview ? 'Successfully submitted for review!' : 'Draft saved successfully!');
      navigate('/submissions');
    } catch (error) {
      console.error('Error saving article', error);
      alert('Error saving article, please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Knowledge</h1>
          
          <div className="flex bg-gray-100 p-1 rounded-xl self-start md:self-auto">
            <button
              type="button"
              onClick={() => setCreationType('article')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                creationType === 'article' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              Article
            </button>
            <button
              type="button"
              onClick={() => setCreationType('video')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                creationType === 'video' 
                  ? 'bg-white text-red-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Video className="w-4 h-4" />
              Video
            </button>
          </div>
        </div>
        
        <form className="space-y-6" onSubmit={(e) => handleSubmit(e, true)}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {creationType === 'article' ? 'Article Title' : 'Video Title'}
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg font-medium"
              placeholder={creationType === 'article' ? "e.g., Understanding Quadratic Equations" : "e.g., Introduction to Algebra Video"}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  setTopic(''); // Reset topic when subject changes
                }}
                required
              >
                <option value="">Select Subject</option>
                {subjects.map((s: any) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
              <select 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                <option value="">Select Topic</option>
                {topics.filter((t: any) => t.subject?._id === subject || t.subject === subject).map((t: any) => (
                  <option key={t._id} value={t._id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
              <select 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
              >
                <option value="7">Grade 7</option>
                <option value="8">Grade 8</option>
                <option value="9">Grade 9</option>
              </select>
            </div>
          </div>

          {creationType === 'article' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
                  <Editor
                    value={content}
                    onChange={(e: any) => setContent(e.target.value)}
                    className="h-64 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Attachments (PDFs or Images)</label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">Click to upload files or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-1">PDF, PNG, JPG up to 10MB</p>
                  <input 
                    type="file" 
                    multiple 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,image/*"
                  />
                </div>
                
                {files.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {files.map((file, index) => (
                      <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                        <button 
                          type="button" 
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}

          {creationType === 'video' && (
            <div className="bg-red-50/50 border border-red-100 p-6 rounded-2xl">
              <label className="block text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Youtube className="w-6 h-6 text-red-600" />
                Add YouTube Video Link
              </label>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Video Title (e.g., Algebra Basics)"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                  value={newYoutubeTitle}
                  onChange={(e) => setNewYoutubeTitle(e.target.value)}
                />
                <input
                  type="url"
                  placeholder="YouTube URL (e.g., https://youtube.com/watch?v=...)"
                  className="flex-2 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none md:w-1/2"
                  value={newYoutubeUrl}
                  onChange={(e) => setNewYoutubeUrl(e.target.value)}
                />
                <button
                  type="button"
                  onClick={addYoutubeLink}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" /> Add Video
                </button>
              </div>
              
              {youtubeLinks.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Added Videos:</h4>
                  <ul className="space-y-3">
                    {youtubeLinks.map((link, index) => (
                      <li key={index} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                            <Youtube className="w-5 h-5 text-red-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{link.title}</p>
                            <p className="text-xs text-gray-500 truncate">{link.url}</p>
                          </div>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeYoutubeLink(index)}
                          className="text-gray-400 hover:text-red-500 p-2 transition-colors flex-shrink-0"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g., algebra, formulas, exam-prep"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, false)}
              className="px-6 py-3 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
            >
              Submit for Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
