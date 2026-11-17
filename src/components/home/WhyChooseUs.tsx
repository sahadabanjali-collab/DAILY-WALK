import React from 'react';
import { Truck, RotateCcw, ShieldCheck, CreditCard } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const items = [
    {
      icon: <Truck className="w-8 h-8 text-neutral-800 stroke-[1.5]" />,
      title: 'Free Shipping',
      subtitle: 'On orders over ₹1,999',
    },
    {
      icon: <RotateCcw className="w-8 h-8 text-neutral-800 stroke-[1.5]" />,
      title: '30-Day Returns',
      subtitle: 'Hassle-free returns',
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-neutral-800 stroke-[1.5]" />,
      title: '100% Authentic',
      subtitle: 'Genuine branded products',
    },
    {
      icon: <CreditCard className="w-8 h-8 text-neutral-800 stroke-[1.5]" />,
      title: 'Secure Payments',
      subtitle: 'Safe & encrypted checkout',
    },
  ];

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="p-3 bg-[#F6F6F6] rounded-2xl flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm sm:text-base text-[#111111]">
                  {item.title}
                </h4>
                <p className="text-xs text-[#777777] font-normal mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
