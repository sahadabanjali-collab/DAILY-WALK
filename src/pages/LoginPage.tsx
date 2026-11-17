import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Footprints,
  KeyRound,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';
  const redirectPath = searchParams.get('redirect') || '/account';

  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [authMethod, setAuthMethod] = useState<'password' | 'magic-link'>('password');
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { signInWithEmail, signUpWithEmail, sendMagicLink, quickDemoLogin, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // If already logged in, show logged-in prompt or redirect
  if (user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 bg-[#F7F7F7]/50">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#E5E5E5] shadow-xs text-center space-y-5">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#111111]">You're already signed in</h2>
            <p className="text-xs text-[#777777] font-medium mt-1">
              Signed in as <strong className="text-[#111111]">{user.email}</strong>
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              to={redirectPath}
              className="w-full py-3 bg-[#111111] text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-[#E53935] transition-colors"
            >
              Continue to {redirectPath === '/checkout' ? 'Checkout' : 'My Account'}
            </Link>
            <Link
              to="/shop"
              className="w-full py-3 bg-[#F7F7F7] text-[#222222] text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Back to Shoes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessNotice('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (mode === 'signup' && !fullName.trim()) {
      setErrorMessage('Please provide your full name.');
      return;
    }

    setSubmitting(true);

    try {
      if (mode === 'signin') {
        const result = await signInWithEmail(email, password);
        if (result.success) {
          showToast('Welcome back!', 'Signed into Daily Walk successfully.', 'success');
          navigate(redirectPath);
        } else {
          setErrorMessage(result.error || 'Invalid email or password.');
          showToast('Sign In Error', result.error || 'Could not verify credentials.', 'error');
        }
      } else {
        const result = await signUpWithEmail(email, password, fullName, phone);
        if (result.success) {
          if (result.requiresVerification) {
            setSuccessNotice(
              'Account created! A confirmation link has been sent to your email. You can check your inbox to verify your account.'
            );
            showToast('Account Created', 'Please check your email to verify.', 'info');
          } else {
            showToast('Welcome to Daily Walk!', 'Your account has been created.', 'success');
            navigate(redirectPath);
          }
        } else {
          setErrorMessage(result.error || 'Sign up failed. Please try again.');
          showToast('Sign Up Failed', result.error || 'Failed to register account.', 'error');
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication error.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessNotice('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await sendMagicLink(email);
      if (res.success) {
        setSuccessNotice(`We sent a secure sign-in magic link to ${email}. Check your inbox or spam folder!`);
        showToast('Magic Link Sent', `Check ${email} for your login link`, 'info');
      } else {
        setErrorMessage(res.error || 'Failed to send magic login link.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error sending magic link.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = () => {
    quickDemoLogin('sahadabanjali@gmail.com', 'Sahada Banjali');
    showToast('Signed in as Sahada', 'Logged in via verified email credentials.', 'success');
    navigate(redirectPath);
  };

  return (
    <div className="py-10 sm:py-14 bg-[#F7F7F7]/50 min-h-[85vh] flex items-center justify-center px-4 sm:px-6">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-[#E5E5E5] shadow-sm overflow-hidden">
        {/* Left Side: Brand Visual & Perks */}
        <div className="lg:col-span-5 bg-[#111111] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#E53935]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2 text-[#E53935]">
              <Footprints className="w-7 h-7" />
              <span className="text-xl font-black tracking-tight text-white">Daily Walk</span>
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-xs font-bold text-gray-200 rounded-full border border-white/10 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#E53935]" />
                Exclusive Member Benefits
              </span>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight text-white">
                Step Into Premium Footwear Comfort.
              </h2>
              <p className="text-xs text-gray-400 font-medium mt-2">
                Join our community of over 50,000+ daily walkers and runners across India.
              </p>
            </div>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-[#E53935]/20 text-[#E53935] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <strong className="block text-white font-bold">Free Express Delivery</strong>
                  <span className="text-gray-400">On every member order across 19,000+ pin codes.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-[#E53935]/20 text-[#E53935] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <strong className="block text-white font-bold">1-Click Fast Checkout</strong>
                  <span className="text-gray-400">Save addresses & auto-sync orders in real time.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-[#E53935]/20 text-[#E53935] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <strong className="block text-white font-bold">Easy 15-Day Return Guarantee</strong>
                  <span className="text-gray-400">No questions asked doorstep shoe exchange.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10 mt-8 flex items-center justify-between text-[11px] text-gray-400">
            <span>100% Original Products</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Supabase Secured
            </span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          {/* Header Switcher: Sign In vs Sign Up */}
          <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4 mb-6">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage('');
                  setSuccessNotice('');
                }}
                className={`text-base font-extrabold pb-2 relative transition-colors ${
                  mode === 'signin' ? 'text-[#111111]' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Sign In
                {mode === 'signin' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#E53935] rounded-full" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage('');
                  setSuccessNotice('');
                }}
                className={`text-base font-extrabold pb-2 relative transition-colors ${
                  mode === 'signup' ? 'text-[#111111]' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Create Account
                {mode === 'signup' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#E53935] rounded-full" />
                )}
              </button>
            </div>

            {/* Quick Demo Login Pill */}
            <button
              type="button"
              onClick={handleQuickDemo}
              className="text-[11px] font-extrabold text-[#E53935] hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full border border-red-200 transition-colors flex items-center gap-1"
              title="Sign in instantly as Sahada Banjali"
            >
              <Sparkles className="w-3 h-3" />
              <span>Quick Demo Sign-In</span>
            </button>
          </div>

          {/* Sub-method toggle (for Sign In only: Password vs Magic Link) */}
          {mode === 'signin' && (
            <div className="flex rounded-xl bg-[#F7F7F7] p-1 mb-5 border border-[#E5E5E5]">
              <button
                type="button"
                onClick={() => setAuthMethod('password')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  authMethod === 'password'
                    ? 'bg-white text-[#111111] shadow-xs'
                    : 'text-[#777777] hover:text-[#111111]'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Password</span>
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('magic-link')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  authMethod === 'magic-link'
                    ? 'bg-white text-[#111111] shadow-xs'
                    : 'text-[#777777] hover:text-[#111111]'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Passwordless Magic Link</span>
              </button>
            </div>
          )}

          {/* Feedback messages */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successNotice && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Form Content */}
          {mode === 'signin' && authMethod === 'magic-link' ? (
            /* Magic Link Flow */
            <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
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
                <p className="text-[11px] text-gray-500 font-medium mt-1">
                  We'll email you a one-click magic link to log in instantly without typing a password.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#111111] text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-[#E53935] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? 'Sending Link...' : 'Send Magic Link'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Standard Password Flow (Sign In or Sign Up) */
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="text-xs font-extrabold text-[#111111] uppercase block mb-1.5">
                    Full Name <span className="text-[#E53935]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Sahada Banjali"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl text-xs font-bold text-[#111111] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#111111]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-extrabold text-[#111111] uppercase block mb-1.5">
                  Email Address <span className="text-[#E53935]">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. yourname@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl text-xs font-bold text-[#111111] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#111111]"
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="text-xs font-extrabold text-[#111111] uppercase block mb-1.5">
                    Mobile Phone <span className="text-gray-400 text-[10px] lowercase">(optional)</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl text-xs font-bold text-[#111111] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#111111]"
                    />
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-extrabold text-[#111111] uppercase">
                    Password <span className="text-[#E53935]">*</span>
                  </label>
                  {mode === 'signin' && (
                    <Link
                      to="/forgot-password"
                      className="text-[11px] font-bold text-[#E53935] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'signup' ? 'Min 6 characters' : 'Enter your password'}
                    className="w-full pl-10 pr-10 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl text-xs font-bold text-[#111111] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#111111]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 mt-2 bg-[#111111] text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-[#E53935] transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
              >
                {submitting
                  ? mode === 'signin'
                    ? 'Signing in...'
                    : 'Creating Account...'
                  : mode === 'signin'
                  ? 'Sign In to Account'
                  : 'Create Daily Walk Account'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Footer note */}
          <div className="mt-6 pt-5 border-t border-[#E5E5E5] text-center text-xs text-[#777777]">
            {mode === 'signin' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage('');
                    setSuccessNotice('');
                  }}
                  className="font-black text-[#111111] hover:text-[#E53935] underline ml-1"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMessage('');
                    setSuccessNotice('');
                  }}
                  className="font-black text-[#111111] hover:text-[#E53935] underline ml-1"
                >
                  Sign in here
                </button>
              </p>
            )}

            {/* Quick Admin Access Button */}
            <div className="mt-4 pt-3 border-t border-dashed border-gray-200 flex flex-col items-center">
              <button
                type="button"
                onClick={() => {
                  quickDemoLogin('sahadabanjali@gmail.com', 'Sahada Banjali');
                  showToast('Admin Mode Active', 'Signed in as Sahada Banjali (Super Admin)', 'success');
                  navigate('/admin');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white hover:bg-[#E53935] text-[11px] font-bold rounded-lg transition-colors shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Super Admin One-Click Login</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
