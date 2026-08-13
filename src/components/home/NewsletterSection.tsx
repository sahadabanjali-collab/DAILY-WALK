import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setIsSubscribed(true);
  };

  return (
    <section className="py-16 bg-[#111111] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-[#E53935] border border-white/10">
          <Mail className="w-7 h-7" />
        </div>

        <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
          Get 10% Off Your First Order
        </h2>

        <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto leading-relaxed">
          Subscribe to Daily Walk and be the first to know about new arrivals, exclusive offers and seasonal collections.
        </p>

        {isSubscribed ? (
          <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-emerald-300 font-extrabold text-sm sm:text-base inline-flex items-center gap-2 animate-fade-in max-w-md mx-auto">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>You're subscribed! Welcome to Daily Walk.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-3.5 bg-white/10 border border-white/20 rounded-2xl text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E53935] focus:bg-white/20 transition-all"
              />
              {error && (
                <span className="text-xs text-[#E53935] font-bold absolute -bottom-5 left-2">
                  {error}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="px-8 py-3.5 bg-[#E53935] hover:bg-red-700 text-white font-extrabold text-sm rounded-2xl transition-colors shadow-lg flex-shrink-0"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
