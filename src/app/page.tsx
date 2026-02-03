'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Review {
  ID: number;
  title: string;
  excerpt: string;
  date: string;
  tags: Record<string, { name: string }>;
  attachments: Record<string, { URL: string }>;
}

interface ApiResponse {
  found: number;
  posts: Review[];
}

const decodeEntities = (str: string) => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = str;
  return textarea.value;
};

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const res = await fetch(`/api/reviews?page=${page}`);
      const data: ApiResponse = await res.json();
      setReviews(data.posts);
      setTotalPages(Math.ceil(data.found / 100));
      setLoading(false);
    };
    fetchReviews();
  }, [page]);

  const filteredReviews = reviews.filter(review =>
    Object.values(review.tags).some(tag => tag.name.toLowerCase().includes(filter.toLowerCase()))
  );

  const getCoverImage = (review: Review) => {
    const attachKeys = Object.keys(review.attachments);
    return attachKeys.length > 0 ? review.attachments[attachKeys[0]].URL : '/placeholder.jpg'; // Fallback image
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 mt-8">Mwende Kyalo Book Reviews</h1>
          <p className="text-xl" style={{ color: 'var(--text-muted)' }}>Discover remarkable stories from across the continent</p>
        </header>
        <div className="mb-8 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Filter by tag (e.g., Nigeria)"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            style={{ 
              backgroundColor: 'var(--surface)', 
              borderColor: 'var(--border)',
              color: 'var(--foreground)'
            }}
          />
        </div>
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary)' }}></div>
            <p className="mt-4" style={{ color: 'var(--text-muted)' }}>Loading reviews...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map(review => (
              <article key={review.ID} className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ backgroundColor: 'var(--surface)' }}>
                <div className="aspect-w-3 aspect-h-4 overflow-hidden">
                  <img
                    src={getCoverImage(review)}
                    alt="Book cover"
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <Link href={`/review/${review.ID}`} className="block">
                    <h2 className="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors" style={{ color: 'var(--foreground)' }}>{decodeEntities(review.title)}</h2>
                    <p dangerouslySetInnerHTML={{ __html: review.excerpt }} className="text-sm mb-4 line-clamp-3" style={{ color: 'var(--text-muted)' }}></p>
                  </Link>
                  <div className="flex items-center justify-between text-xs mb-3" style={{ color: 'var(--text-light)' }}>
                    <span>{new Date(review.date).toLocaleDateString()}</span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                      {Object.values(review.tags).slice(0, 2).map(tag => tag.name).join(', ')}
                    </span>
                  </div>
                  <Link 
                    href={`/review/${review.ID}`} 
                    className="inline-flex items-center font-medium text-sm hover:gap-2 transition-all"
                    style={{ color: 'var(--primary)' }}
                  >
                    Read full review 
                    <span className="ml-1">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
        <div className="mt-12 flex justify-center items-center gap-4">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            disabled={page === 1}
            className="px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
            style={{ 
              backgroundColor: page === 1 ? 'var(--border)' : 'var(--primary)',
              color: page === 1 ? 'var(--text-muted)' : 'white'
            }}
          >
            ← Previous
          </button>
          <span className="px-4 py-2 rounded-lg font-medium" style={{ backgroundColor: 'var(--surface-hover)', color: 'var(--foreground)' }}>
            Page {page} of {totalPages}
          </span>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
            disabled={page === totalPages}
            className="px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
            style={{ 
              backgroundColor: page === totalPages ? 'var(--border)' : 'var(--primary)',
              color: page === totalPages ? 'var(--text-muted)' : 'white'
            }}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}