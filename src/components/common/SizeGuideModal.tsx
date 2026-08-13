import React from 'react';
import { X, Ruler, Footprints } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div
        className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-[#E5E5E5] relative animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-[#E53935]" />
            <h3 className="text-lg font-extrabold text-[#111111]">Daily Walk Size Guide</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#777777] hover:text-[#111111] hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-5 space-y-6">
          <p className="text-xs sm:text-sm text-[#777777]">
            Find your exact footwear fit using our universal sizing conversion table below. If you fall between sizes, we recommend sizing up for sports/running shoes or standard size for formal shoes.
          </p>

          {/* Sizing Table */}
          <div className="overflow-x-auto border border-[#E5E5E5] rounded-xl">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#F7F7F7] text-[#111111] font-bold border-b border-[#E5E5E5]">
                <tr>
                  <th className="py-3 px-4">US Size</th>
                  <th className="py-3 px-4">UK Size (IN)</th>
                  <th className="py-3 px-4">EU Size</th>
                  <th className="py-3 px-4">Foot Length (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5] text-[#222222]">
                {[
                  { us: '6', uk: '5', eu: '39', cm: '24.1' },
                  { us: '7', uk: '6', eu: '40', cm: '25.0' },
                  { us: '8', uk: '7', eu: '41', cm: '25.8' },
                  { us: '9', uk: '8', eu: '42', cm: '26.7' },
                  { us: '10', uk: '9', eu: '43', cm: '27.5' },
                  { us: '11', uk: '10', eu: '44', cm: '28.3' },
                ].map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#F7F7F7]/40'}>
                    <td className="py-2.5 px-4 font-semibold">{row.us}</td>
                    <td className="py-2.5 px-4 font-bold text-[#E53935]">{row.uk}</td>
                    <td className="py-2.5 px-4">{row.eu}</td>
                    <td className="py-2.5 px-4 text-[#777777]">{row.cm} cm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* How to measure foot */}
          <div className="bg-[#F7F7F7] p-4 rounded-xl border border-[#E5E5E5] space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-[#111111]">
              <Footprints className="w-4 h-4 text-[#E53935]" />
              How to measure your foot
            </div>
            <ol className="list-decimal list-inside text-xs text-[#777777] space-y-1.5 leading-relaxed">
              <li>Place a blank sheet of paper flat on a hard surface against a wall.</li>
              <li>Stand on the paper with your heel firmly touching the wall.</li>
              <li>Mark the tip of your longest toe on the paper with a pencil.</li>
              <li>Measure the distance from the edge of the paper to your mark in centimeters.</li>
              <li>Compare your measurement against our foot length chart above.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#E5E5E5] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#111111] text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-[#E53935] transition-colors"
          >
            Got It, Close
          </button>
        </div>
      </div>
    </div>
  );
};
