import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock, ArrowRight, Sparkles } from 'lucide-react';

export const CareersPage: React.FC = () => {
  const openRoles = [
    {
      title: 'Senior Footwear Merchandiser',
      department: 'Merchandising & Brand Partnerships',
      location: 'Mumbai (Bandra Kurla Complex)',
      type: 'Full-time',
    },
    {
      title: 'Full Stack Frontend Engineer (React/TypeScript)',
      department: 'Digital Experience & E-Commerce',
      location: 'Bengaluru / Remote',
      type: 'Full-time',
    },
    {
      title: 'Visual Designer & Sneaker Content Creator',
      department: 'Brand Marketing',
      location: 'Mumbai (In-Studio)',
      type: 'Full-time',
    },
    {
      title: 'Customer Concierge Specialist',
      department: 'Customer Experience',
      location: 'Pune / Remote',
      type: 'Full-time (Rotational)',
    },
    {
      title: 'Supply Chain & Fulfillment Lead',
      department: 'Logistics Operations',
      location: 'Bhiwandi Fulfillment Center, Maharashtra',
      type: 'Full-time',
    },
  ];

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
            <Briefcase className="w-4 h-4 text-neutral-900" />
            CAREERS AT DAILY WALK
          </div>
          <h1 className="font-heading font-black text-4xl sm:text-5xl text-[#111111] tracking-tight leading-tight">
            Build the Future of Modern Footwear Commerce.
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl">
            Join a vibrant team of designers, engineers, and footwear innovators redefining how India discovers, tries, and wears premium shoes.
          </p>
        </div>

        {/* Culture Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-100 rounded-2xl p-6 bg-[#F6F6F6]">
            <h3 className="font-heading font-bold text-base text-neutral-900 mb-1">Sneaker Allowance</h3>
            <p className="text-xs text-neutral-600">Every team member receives an annual pair allowance and exclusive employee early-access drops.</p>
          </div>
          <div className="border border-gray-100 rounded-2xl p-6 bg-[#F6F6F6]">
            <h3 className="font-heading font-bold text-base text-neutral-900 mb-1">Flexible & Hybrid</h3>
            <p className="text-xs text-neutral-600">We prioritize results, autonomy, and work-life harmony over rigid cubicles and punch-card tracking.</p>
          </div>
          <div className="border border-gray-100 rounded-2xl p-6 bg-[#F6F6F6]">
            <h3 className="font-heading font-bold text-base text-neutral-900 mb-1">Comprehensive Health</h3>
            <p className="text-xs text-neutral-600">Complete OPD & family health coverage, mental wellness sessions, and generous fitness subsidies.</p>
          </div>
        </div>

        {/* Open Positions */}
        <div className="space-y-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-black text-2xl text-neutral-900">
              Open Positions ({openRoles.length})
            </h2>
            <span className="text-xs text-neutral-500 font-medium">Updated this week</span>
          </div>

          <div className="space-y-3">
            {openRoles.map((role, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 hover:border-black rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors group"
              >
                <div>
                  <h3 className="font-heading font-bold text-base text-neutral-900 group-hover:text-black">
                    {role.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-neutral-500">
                    <span>{role.department}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {role.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {role.type}
                    </span>
                  </div>
                </div>

                <a
                  href={`mailto:careers@dailywalkshoes.com?subject=Application for ${encodeURIComponent(role.title)}`}
                  className="px-4 py-2 bg-[#F6F6F6] text-neutral-900 text-xs font-bold rounded-full hover:bg-black hover:text-white transition-colors inline-flex items-center gap-1.5 self-start sm:self-center flex-shrink-0"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* General Application */}
        <div className="bg-[#F6F6F6] rounded-2xl p-6 text-center space-y-2">
          <h3 className="font-heading font-bold text-base text-neutral-900">Don't see your dream role?</h3>
          <p className="text-xs text-neutral-600">Send your resume and portfolio to <strong className="text-black">careers@dailywalkshoes.com</strong>. We are always scouting exceptional talent.</p>
        </div>
      </div>
    </div>
  );
};
