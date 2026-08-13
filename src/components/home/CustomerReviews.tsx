import React from 'react';
import { MOCK_REVIEWS } from '../../data/reviews';
import { RatingStars } from '../common/RatingStars';
import { Quote, CheckCircle2 } from 'lucide-react';

export const CustomerReviews: React.FC = () => {
  return (
    <section className="py-16 bg-white border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-black text-[#111111] tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-sm sm:text-base text-[#777777] font-medium mt-1">
            Real feedback from verified buyers stepping out in Daily Walk footwear.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#F7F7F7] p-6 rounded-2xl border border-[#E5E5E5] flex flex-col justify-between hover:shadow-md transition-shadow relative"
            >
              <Quote className="w-8 h-8 text-[#E53935]/20 absolute top-4 right-4" />

              <div className="space-y-3">
                <RatingStars rating={rev.rating} showNumber={false} size="md" />

                <p className="text-xs sm:text-sm text-[#222222] font-semibold leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#E5E5E5] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#111111] text-white font-extrabold text-sm flex items-center justify-center flex-shrink-0">
                  {rev.userName.charAt(0)}
                </div>

                <div>
                  <h4 className="text-xs font-black text-[#111111] flex items-center gap-1">
                    {rev.userName}
                    {rev.verifiedPurchase && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                    )}
                  </h4>
                  <p className="text-[10px] text-[#777777] font-medium">
                    {rev.productName || 'Verified Purchaser'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
