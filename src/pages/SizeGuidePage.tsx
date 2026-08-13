import React from 'react';
import { Ruler, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SizeGuidePage: React.FC = () => {
  return (
    <div className="py-10 bg-[#F7F7F7]/40 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111111] flex items-center gap-2">
              <Ruler className="w-7 h-7 text-[#E53935]" />
              Footwear Size Conversion & Guide
            </h1>
            <p className="text-xs sm:text-sm text-[#777777] font-medium mt-1">
              Find your ideal shoe fit using standard UK, US, EU, and foot length (CM) measurements.
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

        {/* Men's Size Table */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5E5E5] shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-[#111111]">Men's Footwear Size Chart</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-[#111111] border-collapse">
              <thead>
                <tr className="bg-[#111111] text-white">
                  <th className="p-3 font-extrabold">UK / INDIA</th>
                  <th className="p-3 font-extrabold">US</th>
                  <th className="p-3 font-extrabold">EU</th>
                  <th className="p-3 font-extrabold">Foot Length (CM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="p-3 font-bold">6</td><td className="p-3">7</td><td className="p-3">40</td><td className="p-3">24.5 cm</td></tr>
                <tr><td className="p-3 font-bold">7</td><td className="p-3">8</td><td className="p-3">41</td><td className="p-3">25.4 cm</td></tr>
                <tr><td className="p-3 font-bold">8</td><td className="p-3">9</td><td className="p-3">42</td><td className="p-3">26.2 cm</td></tr>
                <tr><td className="p-3 font-bold">9</td><td className="p-3">10</td><td className="p-3">43</td><td className="p-3">27.1 cm</td></tr>
                <tr><td className="p-3 font-bold">10</td><td className="p-3">11</td><td className="p-3">44</td><td className="p-3">27.9 cm</td></tr>
                <tr><td className="p-3 font-bold">11</td><td className="p-3">12</td><td className="p-3">45</td><td className="p-3">28.8 cm</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Women's Size Table */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5E5E5] shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-[#111111]">Women's Footwear Size Chart</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-[#111111] border-collapse">
              <thead>
                <tr className="bg-[#111111] text-white">
                  <th className="p-3 font-extrabold">UK / INDIA</th>
                  <th className="p-3 font-extrabold">US</th>
                  <th className="p-3 font-extrabold">EU</th>
                  <th className="p-3 font-extrabold">Foot Length (CM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="p-3 font-bold">4</td><td className="p-3">6</td><td className="p-3">37</td><td className="p-3">22.5 cm</td></tr>
                <tr><td className="p-3 font-bold">5</td><td className="p-3">7</td><td className="p-3">38</td><td className="p-3">23.5 cm</td></tr>
                <tr><td className="p-3 font-bold">6</td><td className="p-3">8</td><td className="p-3">39</td><td className="p-3">24.5 cm</td></tr>
                <tr><td className="p-3 font-bold">7</td><td className="p-3">9</td><td className="p-3">40</td><td className="p-3">25.5 cm</td></tr>
                <tr><td className="p-3 font-bold">8</td><td className="p-3">10</td><td className="p-3">41</td><td className="p-3">26.5 cm</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* How to measure */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5E5E5] shadow-xs space-y-3">
          <h3 className="text-sm font-extrabold text-[#111111] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#E53935]" />
            How to Measure Your Foot Length
          </h3>
          <ol className="list-decimal list-inside text-xs text-[#222222] space-y-1.5 leading-relaxed font-medium">
            <li>Place a plain piece of paper flat against a straight wall on a flat floor.</li>
            <li>Stand upright with your heel touching the wall, wearing the socks you plan to wear.</li>
            <li>Mark the tip of your longest toe on the paper with a pencil.</li>
            <li>Measure the distance from the edge of the paper to the mark in centimeters.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
