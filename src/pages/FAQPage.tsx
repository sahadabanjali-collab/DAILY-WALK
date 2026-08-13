import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Are all Daily Walk shoes 100% original and authentic?',
      a: 'Yes, absolutely! Daily Walk source directly from verified brand manufacturers and authorized distributors. Every shoe comes with brand guarantee certificates and original tags.',
    },
    {
      q: 'What is the return and exchange policy?',
      a: 'We offer a 15-day door-step return and exchange policy for unused footwear in its original packaging with tags intact. Returns are completely free of charge.',
    },
    {
      q: 'How long does shipping take?',
      a: 'Metropolitan orders are usually delivered within 2–4 business days. Standard nationwide shipping across India takes 3–6 business days.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all major UPI applications (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, Mastercard, RuPay), Net Banking, and Cash on Delivery (COD).',
    },
    {
      q: 'How do I choose my correct shoe size?',
      a: 'You can check our detailed Size Guide available on every product page and in our main menu. It provides exact length conversions in centimeters (CM), UK, US, and EU formats.',
    },
    {
      q: 'Is shipping free on all orders?',
      a: 'Free express shipping is unlocked automatically on all orders above ₹1,999. Orders below ₹1,999 incur a nominal ₹99 delivery fee.',
    },
  ];

  return (
    <div className="py-10 bg-[#F7F7F7]/40 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111111] flex items-center gap-2">
              <HelpCircle className="w-7 h-7 text-[#E53935]" />
              Frequently Asked Questions
            </h1>
            <p className="text-xs sm:text-sm text-[#777777] font-medium mt-1">
              Find instant answers to common questions about orders, sizing, and shipping.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#111111] hover:text-[#E53935]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Shop
          </Link>
        </div>

        {/* Accordion list */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-extrabold text-sm text-[#111111] hover:text-[#E53935] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      isOpen ? 'rotate-180 text-[#E53935]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs text-[#777777] leading-relaxed border-t border-[#E5E5E5]/60 mt-2 pt-3 font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
