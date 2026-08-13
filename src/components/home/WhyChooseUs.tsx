import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Footprints } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: <Truck className="w-7 h-7 text-[#E53935]" />,
      title: 'Free Shipping',
      description: 'Free delivery on eligible orders above ₹1,999 across all pincodes.',
    },
    {
      icon: <RotateCcw className="w-7 h-7 text-[#E53935]" />,
      title: 'Easy Returns',
      description: 'Simple, hassle-free 15-day door-step return & exchange policy.',
    },
    {
      icon: <ShieldCheck className="w-7 h-7 text-[#E53935]" />,
      title: 'Secure Shopping',
      description: '100% safe and encrypted payment gateway experience.',
    },
    {
      icon: <Footprints className="w-7 h-7 text-[#E53935]" />,
      title: 'Quality Footwear',
      description: 'Comfortable, durable styles engineered for real everyday life.',
    },
  ];

  return (
    <section className="py-16 bg-[#F7F7F7] border-y border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-black text-[#111111] tracking-tight">
            Why Choose Daily Walk
          </h2>
          <p className="text-sm sm:text-base text-[#777777] font-medium mt-1">
            We are committed to giving you the best online shoe shopping experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-[#E5E5E5] hover:border-gray-400 hover:shadow-lg transition-all duration-300 text-center flex flex-col items-center"
            >
              <div className="w-14 h-14 bg-[#F7F7F7] rounded-2xl flex items-center justify-center mb-4 border border-[#E5E5E5]">
                {feat.icon}
              </div>
              <h3 className="text-base font-extrabold text-[#111111] mb-2">{feat.title}</h3>
              <p className="text-xs text-[#777777] leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
