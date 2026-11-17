import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { resetPasswordForEmail } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await resetPasswordForEmail(email);
      if (res.success) {
        setSubmitted(true);
        showToast('Reset Link Sent', `Check ${email} for password reset instructions`, 'success');
      } else {
        setErrorMessage(res.error || 'Failed to send reset link.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error occurred while resetting password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-[#F7F7F7]/50 min-h-[75vh] flex items-center justify-center px-4 sm:px-6">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-[#E5E5E5] shadow-xs">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#777777] hover:text-[#111111] mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Sign In
        </Link>

        {submitted ? (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h2 className="text-2xl font-black text-[#111111]">Check your inbox</h2>
            <p className="text-xs text-[#777777] font-medium leading-relaxed">
              We've sent a password reset link to <strong className="text-[#111111]">{email}</strong>. Follow the instructions in the email to set a new password.
            </p>

            <div className="pt-4">
              <Link
                to="/login"
                className="w-full inline-block py-3 bg-[#111111] text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-[#E53935] transition-colors"
              >
                Return to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#E53935] flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-black text-[#111111]">Reset your password</h1>
              <p className="text-xs text-[#777777] font-medium">
                Enter your registered email address and we'll send you a link to reset your account password.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-extrabold text-[#111111] uppercase block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. sahadabanjali@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl text-xs font-bold text-[#111111] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#111111]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#111111] text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-[#E53935] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? 'Sending Link...' : 'Send Reset Link'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
