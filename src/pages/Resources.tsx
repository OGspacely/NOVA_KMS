import React, { useEffect, useState, useRef } from 'react';
import { FileText, Download, BookOpen, Youtube, PlayCircle, Star, Paperclip, FileDown, Flame, Search, Bell, Heart, Play } from 'lucide-react';
import api from '../api/axios.ts';

const PRELOADED_PDFS = Array.from({ length: 30 }).map((_, i) => {
  const subjects = [
    'Mathematics', 'Integrated Science', 'English Language', 'Social Studies', 
    'Ghanaian Language and Culture', 'Design and Technology', 
    'Information and Communication Technology (ICT)', 'French', 
    'Religious and Moral Education (RME)', 'Physical Education and Health (PEH)'
  ];
  const authors = ['Dr. Kwame Nkrumah', 'Prof. Jane Naana', 'Mr. Osei Tutu', 'Mrs. Abena Mensah', 'Dr. Kofi Annan'];
  const subject = subjects[i % subjects.length];
  const isArticle = i % 3 === 0;
  
  return {
    id: `pre-pdf-${i + 1}`,
    title: `Comprehensive Guide to ${subject} - Term ${Math.floor((i % 3) + 1)}`,
    description: `An in-depth exploration of key concepts, theories, and practical applications in the field of ${subject}. Perfect for JHS students preparing for BECE.`,
    type: isArticle ? 'Article' : 'PDF',
    subject: subject,
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    isYoutube: false,
    isArticle: isArticle,
    content: isArticle ? `<p>This is the preloaded article content for ${subject}. It covers essential topics and provides a solid foundation for further study in the Ghanaian curriculum.</p>` : undefined,
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    ratingsCount: Math.floor(Math.random() * 500) + 10,
    author: authors[i % authors.length],
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
  };
});

const PRELOADED_VIDEOS = [
  {
    id: 'pre-1',
    title: 'React Course - Beginner\'s Tutorial',
    description: 'Learn React by building eight real-world projects and solving 140+ coding challenges.',
    subject: 'Web Development',
    url: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
    rating: 4.8,
    author: 'freeCodeCamp.org',
    tags: ['React', 'JavaScript'],
    year: 2022
  },
  {
    id: 'pre-2',
    title: 'Next.js 14 Full Course 2024',
    description: 'Build and deploy a full-stack Next.js 14 application.',
    subject: 'Web Development',
    url: 'https://www.youtube.com/watch?v=wm5gMKuwSYk',
    rating: 4.9,
    author: 'JavaScript Mastery',
    tags: ['Next.js', 'React'],
    year: 2024
  },
  {
    id: 'pre-3',
    title: 'Tailwind CSS Full Course',
    description: 'Learn Tailwind CSS by building a responsive landing page.',
    subject: 'CSS Frameworks',
    url: 'https://www.youtube.com/watch?v=lCxcTsOHrjo',
    rating: 4.7,
    author: 'Traversy Media',
    tags: ['Tailwind', 'CSS'],
    year: 2023
  },
  {
    id: 'pre-4',
    title: 'TypeScript Full Course for Beginners',
    description: 'Learn TypeScript from scratch in this full course.',
    subject: 'Programming',
    url: 'https://www.youtube.com/watch?v=BwuLxPH8IDs',
    rating: 4.8,
    author: 'Programming with Mosh',
    tags: ['TypeScript', 'JavaScript'],
    year: 2023
  },
  {
    id: 'pre-5',
    title: 'Node.js Full Course',
    description: 'Learn Node.js by building a real-world REST API.',
    subject: 'Backend',
    url: 'https://www.youtube.com/watch?v=Oe421EPjeBE',
    rating: 4.6,
    author: 'freeCodeCamp.org',
    tags: ['Node.js', 'Backend'],
    year: 2021
  },
  {
    id: 'pre-6',
    title: 'Express.js Crash Course',
    description: 'Learn Express.js in this crash course for beginners.',
    subject: 'Backend',
    url: 'https://www.youtube.com/watch?v=L72fhGm1tfE',
    rating: 4.5,
    author: 'Traversy Media',
    tags: ['Express', 'Node.js'],
    year: 2021
  },
  {
    id: 'pre-7',
    title: 'MongoDB Crash Course',
    description: 'Learn MongoDB in this crash course for beginners.',
    subject: 'Database',
    url: 'https://www.youtube.com/watch?v=ExcRbA7fq1A',
    rating: 4.7,
    author: 'Web Dev Simplified',
    tags: ['MongoDB', 'Database'],
    year: 2022
  },
  {
    id: 'pre-8',
    title: 'Docker Tutorial for Beginners',
    description: 'Learn Docker in this full course for beginners.',
    subject: 'DevOps',
    url: 'https://www.youtube.com/watch?v=pTFZFxd4hOI',
    rating: 4.8,
    author: 'TechWorld with Nana',
    tags: ['Docker', 'DevOps'],
    year: 2021
  },
  {
    id: 'pre-9',
    title: 'Git and GitHub for Beginners',
    description: 'Learn Git and GitHub in this crash course.',
    subject: 'Version Control',
    url: 'https://www.youtube.com/watch?v=RGOj5yH7evk',
    rating: 4.9,
    author: 'freeCodeCamp.org',
    tags: ['Git', 'GitHub'],
    year: 2020
  },
  {
    id: 'pre-10',
    title: 'Python Tutorial for Beginners',
    description: 'Learn Python programming in this full course.',
    subject: 'Programming',
    url: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
    rating: 4.8,
    author: 'Programming with Mosh',
    tags: ['Python', 'Beginner'],
    year: 2019
  },
  {
    id: 'pre-11',
    title: 'JavaScript Full Course',
    description: 'Learn JavaScript from scratch.',
    subject: 'Programming',
    url: 'https://www.youtube.com/watch?v=jS4aFq5-91M',
    rating: 4.7,
    author: 'Bro Code',
    tags: ['JavaScript', 'Web'],
    year: 2022
  },
  {
    id: 'pre-12',
    title: 'HTML & CSS Full Course',
    description: 'Learn HTML and CSS from scratch.',
    subject: 'Web Development',
    url: 'https://www.youtube.com/watch?v=G3e-cpL7ofc',
    rating: 4.9,
    author: 'SuperSimpleDev',
    tags: ['HTML', 'CSS'],
    year: 2021
  },
  {
    id: 'pre-13',
    title: 'SQL Tutorial for Beginners',
    description: 'Learn SQL in this full course.',
    subject: 'Database',
    url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
    rating: 4.6,
    author: 'freeCodeCamp.org',
    tags: ['SQL', 'Database'],
    year: 2020
  },
  {
    id: 'pre-14',
    title: 'Linux Crash Course',
    description: 'Learn Linux command line in this crash course.',
    subject: 'OS',
    url: 'https://www.youtube.com/watch?v=sWbUDq4S6Y8',
    rating: 4.7,
    author: 'freeCodeCamp.org',
    tags: ['Linux', 'CLI'],
    year: 2021
  },
  {
    id: 'pre-15',
    title: 'AWS Certified Cloud Practitioner',
    description: 'Pass the AWS CCP exam with this full course.',
    subject: 'Cloud',
    url: 'https://www.youtube.com/watch?v=SOTamWNgDKc',
    rating: 4.8,
    author: 'freeCodeCamp.org',
    tags: ['AWS', 'Cloud'],
    year: 2022
  },
  {
    id: 'pre-16',
    title: 'Kubernetes Tutorial for Beginners',
    description: 'Learn Kubernetes in this full course.',
    subject: 'DevOps',
    url: 'https://www.youtube.com/watch?v=X48VuDVv0do',
    rating: 4.7,
    author: 'TechWorld with Nana',
    tags: ['Kubernetes', 'DevOps'],
    year: 2021
  },
  {
    id: 'pre-17',
    title: 'Figma Tutorial for Beginners',
    description: 'Learn Figma UI/UX design.',
    subject: 'Design',
    url: 'https://www.youtube.com/watch?v=jwCmibJ8Jfc',
    rating: 4.8,
    author: 'Envato Tuts+',
    tags: ['Figma', 'Design'],
    year: 2022
  },
  {
    id: 'pre-18',
    title: 'UI/UX Design Course',
    description: 'Learn UI/UX design principles.',
    subject: 'Design',
    url: 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU',
    rating: 4.9,
    author: 'freeCodeCamp.org',
    tags: ['UI', 'UX'],
    year: 2021
  },
  {
    id: 'pre-19',
    title: 'Machine Learning for Everybody',
    description: 'Learn Machine Learning concepts.',
    subject: 'AI/ML',
    url: 'https://www.youtube.com/watch?v=i_LwzRVP7bg',
    rating: 4.8,
    author: 'freeCodeCamp.org',
    tags: ['ML', 'AI'],
    year: 2022
  },
  {
    id: 'pre-20',
    title: 'Data Structures and Algorithms',
    description: 'Learn DSA in this full course.',
    subject: 'Computer Science',
    url: 'https://www.youtube.com/watch?v=8hly31xKli0',
    rating: 4.7,
    author: 'freeCodeCamp.org',
    tags: ['DSA', 'Algorithms'],
    year: 2021
  },
  {
    id: 'pre-21',
    title: 'HTML Tutorial for Beginners',
    description: 'Learn HTML basics.',
    subject: 'Web Development',
    url: 'https://www.youtube.com/watch?v=qz0aGYrrlhU',
    rating: 4.6,
    author: 'Programming with Mosh',
    tags: ['HTML', 'Web'],
    year: 2021
  }
];

export const Resources = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pdfs' | 'videos'>('pdfs');
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const notifications = [
    { id: 1, text: 'New video added: Advanced React Patterns', time: '2 hours ago', unread: true },
    { id: 2, text: 'Your downloaded PDF "Physics 101" has been updated', time: '1 day ago', unread: true },
    { id: 3, text: 'James Banistor replied to your comment', time: '2 days ago', unread: false },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await api.get('/articles');
        const articles = Array.isArray(res.data) ? res.data : [];
        
        let allResources: any[] = [];
        
        articles.forEach((article: any) => {
          // 1. The Article itself (treat as PDF/Document for this view)
          allResources.push({
            id: `art-${article._id}`,
            title: article.title,
            description: article.content.replace(/<[^>]+>/g, '').substring(0, 120) + '...',
            type: 'Article',
            subject: article.subject?.name || 'General',
            url: `/articles/${article._id}`,
            isYoutube: false,
            isArticle: true,
            content: article.content,
            rating: article.rating || 0,
            ratingsCount: article.ratingsCount || 0,
            author: article.author?.name || 'Unknown Author',
            createdAt: article.createdAt
          });

          // 2. Attachments
          if (article.attachments) {
            article.attachments.forEach((att: any) => {
              allResources.push({
                id: `att-${att._id || Math.random()}`,
                title: att.name || att.filename || 'Document',
                description: `Attachment from: ${article.title}`,
                type: att.type?.includes('pdf') ? 'PDF' : 'File',
                subject: article.subject?.name || 'General',
                url: att.url,
                isYoutube: false,
                isArticle: false,
                rating: article.rating || 0,
                ratingsCount: article.ratingsCount || 0,
                author: article.author?.name || 'Unknown Author',
                createdAt: article.createdAt
              });
            });
          }
          
          // 3. YouTube Links
          if (article.youtubeLinks) {
            article.youtubeLinks.forEach((link: any) => {
              allResources.push({
                id: `yt-${link._id || Math.random()}`,
                title: link.title,
                description: `Video from: ${article.title}`,
                type: 'Video',
                subject: article.subject?.name || 'General',
                url: link.url,
                isYoutube: true,
                isArticle: false,
                rating: article.rating || 0,
                ratingsCount: article.ratingsCount || 0,
                author: article.author?.name || 'Unknown Author',
                createdAt: article.createdAt
              });
            });
          }
        });
        
        // Sort by newest first
        allResources.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setResources(allResources);
      } catch (error) {
        console.error('Error fetching resources', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResources();
  }, []);

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleDownload = async (e: React.MouseEvent, resource: any) => {
    if (resource.isYoutube) {
      return; // Let the <a> tag handle it
    }
    
    e.preventDefault();
    
    if (resource.isArticle) {
      const element = document.createElement("a");
      const file = new Blob([
        `<!DOCTYPE html><html><head><title>${resource.title}</title></head><body style="font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem;"><h1>${resource.title}</h1>${resource.content}</body></html>`
      ], {type: 'text/html'});
      element.href = URL.createObjectURL(file);
      element.download = `${resource.title.replace(/\s+/g, '_')}.html`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else {
      try {
        const response = await fetch(resource.url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = resource.title || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error('Download failed, opening in new tab', error);
        window.open(resource.url, '_blank');
      }
    }
  };

  const handleRate = async (e: React.MouseEvent, resource: any, newRating: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (resource.id.startsWith('pre-')) {
      alert('Cannot rate preloaded content.');
      return;
    }

    try {
      const articleId = resource.id.replace('art-', '').replace('att-', '').replace('yt-', '');
      await api.post(`/articles/${articleId}/rate`, { rating: newRating });
      
      // Update local state
      setResources(prev => prev.map(r => {
        if (r.id === resource.id) {
          const currentTotal = r.rating * r.ratingsCount;
          const newCount = r.ratingsCount + 1;
          const updatedRating = (currentTotal + newRating) / newCount;
          return { ...r, rating: Number(updatedRating.toFixed(1)), ratingsCount: newCount };
        }
        return r;
      }));
      alert('Rating submitted successfully!');
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating.');
    }
  };

  // Combine fetched PDFs with preloaded PDFs
  const allPdfs = [...resources.filter(r => !r.isYoutube), ...PRELOADED_PDFS];
  const uniquePdfsMap = new Map();
  allPdfs.forEach(p => {
    if (!uniquePdfsMap.has(p.url)) {
      uniquePdfsMap.set(p.url, p);
    }
  });
  const pdfs = Array.from(uniquePdfsMap.values()).slice(0, 30);
  
  // Combine fetched videos with preloaded videos, deduplicate by URL
  const allVideos = [...resources.filter(r => r.isYoutube), ...PRELOADED_VIDEOS.map(v => ({...v, isYoutube: true, isArticle: false}))];
  const uniqueVideosMap = new Map();
  allVideos.forEach(v => {
    if (!uniqueVideosMap.has(v.url)) {
      uniqueVideosMap.set(v.url, v);
    }
  });
  const videos = Array.from(uniqueVideosMap.values());

  const featured = videos[0];
  const trending = videos.slice(1, 4);
  const comingSoon = videos.slice(4, 7);
  const continueWatching = videos.slice(7, 11);
  const friendsActivity = [
    { name: 'James Banistor', avatar: 'https://i.pravatar.cc/150?u=1', action: 'Is now watching React Course' },
    { name: 'Jenna Barbera', avatar: 'https://i.pravatar.cc/150?u=2', action: 'Is now watching Next.js 14' },
    { name: 'Sara Cameron', avatar: 'https://i.pravatar.cc/150?u=3', action: 'Is now watching Tailwind CSS' },
    { name: 'Jonathan Paul', avatar: 'https://i.pravatar.cc/150?u=4', action: 'Is now watching Node.js' },
  ];

  if (loading) return <div className="p-8 text-center text-gray-500">Loading resources...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Learning Resources</h1>
              <p className="text-gray-500 mt-1">Access study materials, documents, and video tutorials.</p>
            </div>
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-xl self-start md:self-auto">
            <button
              onClick={() => setActiveTab('pdfs')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === 'pdfs' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              Documents & PDFs
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === 'videos' 
                  ? 'bg-white text-red-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Youtube className="w-4 h-4" />
              Video Tutorials
            </button>
          </div>
        </div>

        {activeTab === 'pdfs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pdfs.map((resource) => (
              <div key={resource.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-blue-300 hover:shadow-md transition-all flex flex-col group">
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${resource.isArticle ? 'bg-purple-50 text-purple-500' : 'bg-blue-50 text-blue-500'}`}>
                        {resource.isArticle ? <FileText className="w-6 h-6" /> : <FileDown className="w-6 h-6" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2" title={resource.title}>{resource.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                            {resource.subject}
                          </span>
                          <span className="text-xs text-gray-500">{resource.type}</span>
                          {resource.rating !== undefined && (
                            <div className="flex items-center gap-1 text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-md ml-auto group/rating relative">
                              <Star className="w-3 h-3 fill-current" />
                              {resource.rating}
                              
                              {/* Rating Tooltip */}
                              <div className="absolute bottom-full right-0 mb-2 hidden group-hover/rating:flex bg-white shadow-lg rounded-lg p-2 border border-gray-100 z-10">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <button
                                    key={star}
                                    onClick={(e) => handleRate(e, resource, star)}
                                    className="p-1 hover:scale-110 transition-transform"
                                  >
                                    <Star className={`w-4 h-4 ${star <= resource.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-3" title={resource.description}>
                    {resource.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                        {resource.author.charAt(0)}
                      </div>
                      <span className="text-xs text-gray-500 truncate max-w-[100px]">{resource.author}</span>
                    </div>
                    <a 
                      href={resource.url}
                      onClick={(e) => handleDownload(e, resource)}
                      className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                </div>
              </div>
            ))}
            {pdfs.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                No documents found.
              </div>
            )}
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="flex flex-col lg:flex-row gap-8 bg-[#f8f9fa] p-6 rounded-3xl">
            {/* Left Content */}
            <div className="flex-1 space-y-8">
              
              {/* Featured */}
              {featured && (
                <a href={featured.url} target="_blank" rel="noopener noreferrer" className="block relative rounded-3xl overflow-hidden aspect-[21/9] group shadow-sm">
                  <img src={`https://img.youtube.com/vi/${getYoutubeId(featured.url)}/maxresdefault.jpg`} onError={(e) => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${getYoutubeId(featured.url)}/hqdefault.jpg`; }} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                  
                  <div className="absolute top-6 left-6 flex gap-2">
                    {featured.tags?.slice(0, 2).map((tag: string) => (
                      <span key={tag} className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white text-sm rounded-full border border-white/10">
                        {tag}
                      </span>
                    ))}
                    {!featured.tags && (
                      <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white text-sm rounded-full border border-white/10">
                        {featured.subject}
                      </span>
                    )}
                  </div>
                  
                  <div className="absolute top-6 right-6 px-3 py-1.5 bg-white/20 backdrop-blur-md text-white text-sm font-medium rounded-full flex items-center gap-1 border border-white/10">
                    {featured.rating?.toFixed(1) || '4.5'} <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                  </div>

                  <div className="absolute bottom-0 left-0 p-8 w-full md:w-2/3">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{featured.title}</h2>
                    <p className="text-gray-300 text-sm md:text-base mb-6 line-clamp-2">{featured.description}</p>
                    
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white px-6 py-2.5 rounded-full font-medium transition-colors">
                        <Play className="w-5 h-5 fill-current" /> Watch
                      </button>
                      <button className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-colors border border-white/10">
                        <Heart className="w-5 h-5" />
                      </button>
                      
                      <div className="hidden sm:flex items-center gap-3 ml-4">
                        <div className="flex -space-x-3">
                          <img src="https://i.pravatar.cc/150?u=10" className="w-8 h-8 rounded-full border-2 border-black" />
                          <img src="https://i.pravatar.cc/150?u=11" className="w-8 h-8 rounded-full border-2 border-black" />
                          <img src="https://i.pravatar.cc/150?u=12" className="w-8 h-8 rounded-full border-2 border-black" />
                          <div className="w-8 h-8 rounded-full border-2 border-black bg-gray-800 text-white text-xs flex items-center justify-center">3+</div>
                        </div>
                        <span className="text-gray-300 text-sm">Friends are<br/>watching</span>
                      </div>
                    </div>
                  </div>
                </a>
              )}

              {/* Trending now */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">Trending now <Flame className="w-5 h-5 text-orange-500 fill-current" /></h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {trending.map(video => (
                    <a key={video.id} href={video.url} target="_blank" rel="noopener noreferrer" className="group relative aspect-[4/5] rounded-3xl overflow-hidden shadow-sm block">
                      <img src={`https://img.youtube.com/vi/${getYoutubeId(video.url)}/hqdefault.jpg`} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/20" />
                      
                      <div className="absolute top-4 left-4 px-2.5 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-medium rounded-full flex items-center gap-1 border border-white/10">
                        {video.rating?.toFixed(1) || '4.5'} <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      </div>
                      
                      <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-colors border border-white/10">
                        <Heart className="w-4 h-4" />
                      </button>

                      <div className="absolute bottom-0 left-0 p-5 w-full">
                        <h4 className="text-white font-bold text-lg leading-tight mb-1 line-clamp-2">{video.title}</h4>
                        <p className="text-gray-300 text-sm">{video.subject}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Coming soon */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Coming soon</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {comingSoon.map(video => (
                    <a key={video.id} href={video.url} target="_blank" rel="noopener noreferrer" className="group relative aspect-[4/5] rounded-3xl overflow-hidden shadow-sm block">
                      <img src={`https://img.youtube.com/vi/${getYoutubeId(video.url)}/hqdefault.jpg`} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/20" />
                      
                      <div className="absolute top-4 left-4 px-2.5 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-medium rounded-full flex items-center gap-1 border border-white/10">
                        {video.rating?.toFixed(1) || '4.5'} <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      </div>
                      
                      <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-colors border border-white/10">
                        <Heart className="w-4 h-4" />
                      </button>

                      <div className="absolute bottom-0 left-0 p-5 w-full">
                        <h4 className="text-white font-bold text-lg leading-tight mb-1 line-clamp-2">{video.title}</h4>
                        <p className="text-gray-300 text-sm">{video.subject}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-full lg:w-80 flex flex-col gap-8">
              {/* Search & Profile (Mock) */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Search" className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="relative" ref={notificationRef}>
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {notifications.some(n => n.unread) && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#f8f9fa]"></span>
                    )}
                  </button>
                  
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">Notifications</h3>
                        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">Mark all as read</button>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map(notification => (
                          <div key={notification.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${notification.unread ? 'bg-blue-50/50' : ''}`}>
                            <p className="text-sm text-gray-800">{notification.text}</p>
                            <span className="text-xs text-gray-500 mt-1 block">{notification.time}</span>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 text-center border-t border-gray-100">
                        <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">View all notifications</button>
                      </div>
                    </div>
                  )}
                </div>
                <img src="https://i.pravatar.cc/150?u=me" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
              </div>

              {/* Continue watching */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Continue watching</h3>
                <div className="space-y-4">
                  {continueWatching.map(video => (
                    <a key={video.id} href={video.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                      <div className="relative w-32 aspect-video rounded-xl overflow-hidden flex-shrink-0">
                        <img src={`https://img.youtube.com/vi/${getYoutubeId(video.url)}/hqdefault.jpg`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <PlayCircle className="w-8 h-8 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 truncate">{video.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{video.subject}</p>
                        <p className="text-xs text-gray-400 mt-1">{video.year || 2023}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Friends activity */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Friends activity</h3>
                <div className="space-y-4">
                  {friendsActivity.map((friend, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img src={friend.avatar} className="w-10 h-10 rounded-full object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900">{friend.name}</h4>
                        <p className="text-xs text-gray-500 truncate">{friend.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
