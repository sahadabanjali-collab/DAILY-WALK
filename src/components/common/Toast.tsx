import React from 'react';
import { useToast, ToastMessage } from '../../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

export const Toast = ToastContainer;

const ToastCard: React.FC<{ toast: ToastMessage; onClose: () => void }> = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />,
  };

  const bgStyles = {
    success: 'bg-white border-l-4 border-l-emerald-500 shadow-xl',
    warning: 'bg-white border-l-4 border-l-amber-500 shadow-xl',
    error: 'bg-white border-l-4 border-l-red-500 shadow-xl',
    info: 'bg-white border-l-4 border-l-blue-500 shadow-xl',
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-r-xl border border-gray-100 ${
        bgStyles[toast.type]
      } transition-all duration-300 animate-slide-in-right`}
    >
      {icons[toast.type]}
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold text-[#111111] leading-tight">{toast.title}</h4>
        {toast.description && (
          <p className="text-[11px] text-[#777777] mt-0.5 truncate">{toast.description}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
