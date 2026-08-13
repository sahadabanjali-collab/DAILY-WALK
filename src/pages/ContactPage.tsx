import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="py-10 bg-[#F7F7F7]/40 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111111] flex items-center gap-2">
              <Mail className="w-7 h-7 text-[#E53935]" />
              Contact & Customer Support
            </h1>
            <p className="text-xs sm:text-sm text-[#777777] font-medium mt-1">
              Have questions about an order or shoe fit? We're here to help!
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Info cards */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E5E5E5] space-y-2">
              <Phone className="w-5 h-5 text-[#E53935]" />
              <h3 className="text-xs font-extrabold uppercase text-[#111111]">Phone Helpline</h3>
              <p className="text-xs text-[#777777] font-bold">+91 1800 266 8920</p>
              <p className="text-[10px] text-gray-400">Mon-Sat, 9am - 7pm IST</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5E5E5] space-y-2">
              <Mail className="w-5 h-5 text-[#E53935]" />
              <h3 className="text-xs font-extrabold uppercase text-[#111111]">Email Support</h3>
              <p className="text-xs text-[#777777] font-bold">support@dailywalkshoes.com</p>
              <p className="text-[10px] text-gray-400">Avg. response within 2 hours</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5E5E5] space-y-2">
              <MapPin className="w-5 h-5 text-[#E53935]" />
              <h3 className="text-xs font-extrabold uppercase text-[#111111]">Headquarters</h3>
              <p className="text-xs text-[#777777] font-bold">
                Daily Walk Footwear Pvt Ltd, Level 4, Express Towers, Nariman Point, Mumbai 400021
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-[#E5E5E5] shadow-xs">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-[#111111]">Message Sent Successfully!</h3>
                <p className="text-xs text-[#777777]">
                  Thank you for reaching out. Our support team will get back to you within 2 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-base font-extrabold text-[#111111]">Send Us a Message</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-extrabold text-[#111111] uppercase block mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Patel"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl text-xs font-bold text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-[#111111] uppercase block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="priya@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl text-xs font-bold text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-[#111111] uppercase block mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Size exchange request for Order DW-82931"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl text-xs font-bold text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-[#111111] uppercase block mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe how we can help you..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl text-xs font-bold text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#111111] hover:bg-[#E53935] text-white text-xs font-extrabold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Support Request</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
