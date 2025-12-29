import { notFound } from 'next/navigation';
import UserReviews from '@/components/UserReviews';

interface Review {
  ID: number;
  title: string;
  content: string;
  date: string;
  categories: Record<string, { name: string }>;
  tags: Record<string, { name: string }>;
  attachments: Record<string, { URL: string }>;
}

async function getReview(id: string): Promise<Review | null> {
  const res = await fetch(`https://public-api.wordpress.com/rest/v1.1/sites/mwendekyalobookreviews.wordpress.com/posts/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const review = await getReview(id);
  if (!review) notFound();

  const getCoverImage = () => {
    const attachKeys = Object.keys(review.attachments);
    return attachKeys.length > 0 ? review.attachments[attachKeys[0]].URL : '/placeholder.jpg';
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <article className="rounded-2xl overflow-hidden shadow-xl" style={{ backgroundColor: 'var(--surface)' }}>
          <header className="p-8 border-b" style={{ borderColor: 'var(--border)' }}>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 ">{review.title}</h1><div className="flex items-center gap-2 text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
              <span>Book Review</span>
              <span>•</span>
              <span>{new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </header>
        
          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-8 mb-8">
              <div className="lg:w-1/3">
                <div className="sticky top-8">
                    <br></br>
                    <br></br>
                  <img 
                    src={getCoverImage()} 
                    alt="Book cover" 
                    className="w-full rounded-xl shadow-lg object-cover"
                  />
                  <div className="mt-6 space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Categories</h3>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        {Object.values(review.categories).length > 0 
                          ? Object.values(review.categories).map(cat => cat.name).join(', ')
                          : 'No categories'
                        }
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {Object.values(review.tags).length > 0
                          ? Object.values(review.tags).map((tag, index) => (
                              <span key={index} className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--surface-hover)', color: 'var(--text-muted)' }}>
                                {tag.name}
                              </span>
                            ))
                          : <span className="text-sm" style={{ color: 'var(--text-muted)' }}>No tags</span>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-2/3">
                {/* <div 
                  dangerouslySetInnerHTML={{ __html: review.content }} 
                  className="prose prose-lg max-w-none leading-relaxed"
                  style={{ color: 'var(--foreground)' }}
                /> */}
                <div 
                  dangerouslySetInnerHTML={{ __html: review.content.replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, '') 
  .replace(/<img[^>]*>/gi, '') }} 
                  className="prose prose-lg max-w-none leading-relaxed"
                  style={{ color: 'var(--foreground)' }}
                />
              </div>
            </div>
          </div>
        </article>
        
        <div className="mt-8">
          <a 
            href="/" 
            className="inline-flex items-center px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
            style={{ backgroundColor: 'var(--surface)', color: 'var(--primary)' }}
          >
            ← Back to Reviews
          </a>
        </div>
        
        <UserReviews bookId={id} />
      </div>
    </div>
  );
}

// For dynamic updates: Revalidate every 3600 seconds (1 hour)
export const revalidate = 3600;