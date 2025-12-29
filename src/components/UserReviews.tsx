'use client';

import { useState } from 'react';

interface UserReview {
  id: string;
  author: string;
  rating: number;
  content: string;
  date: string;
}

interface UserReviewsProps {
  bookId: string;
}

export default function UserReviews({ bookId }: UserReviewsProps) {
  const [reviews, setReviews] = useState<UserReview[]>([
    {
      id: '1',
      author: 'Sarah M.',
      rating: 5,
      content: 'This book completely transformed my perspective on African literature. The writing is beautiful and the story is unforgettable.',
      date: '2024-12-15'
    },
    {
      id: '2',
      author: 'John K.',
      rating: 4,
      content: 'A powerful narrative that captures the essence of modern African storytelling. Highly recommended.',
      date: '2024-12-10'
    }
  ]);
  
  const [newReview, setNewReview] = useState({
    author: '',
    rating: 5,
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.author.trim() || !newReview.content.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const review: UserReview = {
        id: Date.now().toString(),
        author: newReview.author,
        rating: newReview.rating,
        content: newReview.content,
        date: new Date().toISOString().split('T')[0]
      };
      
      setReviews([review, ...reviews]);
      setNewReview({ author: '', rating: 5, content: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="mt-8">
      <div className="rounded-2xl overflow-hidden shadow-xl" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="p-8 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Reader Reviews</h2>
          <p className="mt-2" style={{ color: 'var(--text-muted)' }}>Share your thoughts about this book</p>
        </div>
        
        {/* Review Form */}
        <div className="p-8 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-hover)' }}>
          <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--foreground)' }}>Write Your Review</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>Your Name</label>
              <input
                type="text"
                value={newReview.author}
                onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                style={{ 
                  backgroundColor: 'var(--surface)', 
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
                placeholder="Enter your name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className={`text-3xl transition-all transform hover:scale-110 ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>Your Review</label>
              <textarea
                value={newReview.content}
                onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent h-32 resize-none"
                style={{ 
                  backgroundColor: 'var(--surface)', 
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
                placeholder="Share your thoughts about this book..."
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: isSubmitting ? 'var(--border)' : 'var(--primary)',
                color: 'white'
              }}
            >
              {isSubmitting ? 'Posting...' : 'Post Review'}
            </button>
          </form>
        </div>
      
        {/* Reviews List */}
        <div className="p-8">
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg" style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="p-6 rounded-xl" style={{ backgroundColor: 'var(--surface-hover)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>{review.author}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm" style={{ color: 'var(--text-light)' }}>
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>{review.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
