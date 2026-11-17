import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Clock, ArrowRight, User } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const articles = [
    {
      id: 'air-jordan-history',
      title: 'The Evolution of Air Jordans: From 1985 Hardwood to Modern Street Culture',
      category: 'Sneaker Culture',
      excerpt: 'Explore how Peter Moore’s 1985 high-top silhouette broke NBA uniform regulations and kicked off a four-decade global footwear phenomenon.',
      readTime: '6 min read',
      date: 'Nov 02, 2026',
      author: 'Aarav Mehta',
      image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'running-shoe-rotation',
      title: 'Why You Need a 2-Shoe Rotation: Science of Midsole Foam Recovery',
      category: 'Performance & Running',
      excerpt: 'Biomechanists explain why alternating between daily training trainers and carbon-plated speed day shoes preserves foam rebound and prevents injury.',
      readTime: '5 min read',
      date: 'Oct 28, 2026',
      author: 'Dr. Priya Sen',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'clean-white-sneakers',
      title: 'How to Keep White Leather Sneakers Looking Brand New Forever',
      category: 'Care & Maintenance',
      excerpt: 'A comprehensive step-by-step masterclass on brushing, mid-sole oxygen treatment, and waterproof nano-coating protection.',
      readTime: '4 min read',
      date: 'Oct 20, 2026',
      author: 'Rohan Verma',
      image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'retro-runners-trend',
      title: 'The Unstoppable Rise of Y2K Metallic Runners in 2026',
      category: 'Trends',
      excerpt: 'From New Balance 530s to Asics Gel-Kayano, here is why retro silver mesh sneakers have become the undisputed uniform of fashion week.',
      readTime: '5 min read',
      date: 'Oct 15, 2026',
      author: 'Ananya Kapoor',
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
            <BookOpen className="w-4 h-4 text-neutral-900" />
            THE DAILY WALK JOURNAL
          </div>
          <h1 className="font-heading font-black text-4xl sm:text-5xl text-[#111111] tracking-tight leading-tight">
            Stories, Style Guides, and Sole Science.
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl">
            In-depth guides on sneaker preservation, release breakdowns, and biomechanics from our footwear design team.
          </p>
        </div>

        {/* Featured Article Card */}
        <div className="bg-[#F6F6F6] rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-6 aspect-[4/3] w-full overflow-hidden">
            <img
              src={articles[0].image}
              alt={articles[0].title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="md:col-span-6 p-6 sm:p-8 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              {articles[0].category}
            </span>
            <h2 className="font-heading font-black text-xl sm:text-2xl text-neutral-900 hover:text-black leading-snug">
              {articles[0].title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 line-clamp-3">
              {articles[0].excerpt}
            </p>
            <div className="flex items-center gap-4 text-xs text-neutral-400 pt-2">
              <span>{articles[0].date}</span>
              <span>•</span>
              <span>{articles[0].readTime}</span>
            </div>
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
          {articles.slice(1).map((post) => (
            <div key={post.id} className="flex flex-col justify-between group">
              <div>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 mb-4">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  {post.category}
                </span>
                <h3 className="font-heading font-bold text-base text-neutral-900 mt-1 line-clamp-2 group-hover:text-black">
                  {post.title}
                </h3>
                <p className="text-xs text-neutral-500 mt-2 line-clamp-2">
                  {post.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-4 pt-3 border-t border-gray-100">
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
