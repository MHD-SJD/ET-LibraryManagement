import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import logoImg from '../assets/logo.jpg';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LogIn, ShieldAlert } from 'lucide-react';
import { DEMO_ADMIN, DEMO_MEMBER } from '../data/mockUsers';

export const Login = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isAdminRequested = searchParams.get('role') === 'admin' || location.state?.from?.startsWith?.('/admin');

  const [role, setRole] = useState(isAdminRequested ? 'admin' : 'member');
  const [email, setEmail] = useState(isAdminRequested ? DEMO_ADMIN.email : '');
  const [password, setPassword] = useState(isAdminRequested ? 'admin123' : '');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAdminRequested) {
      setRole('admin');
      setEmail(DEMO_ADMIN.email);
      setPassword('admin123');
    }
  }, [isAdminRequested]);

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please provide a valid email format.';
    }
    if (!password.trim()) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    login({ email, password, role });
    showToast(`Signed in successfully as ${role === 'admin' ? 'Librarian/Admin' : 'Member'}!`, 'success');

    const redirectPath = location.state?.from || (role === 'admin' ? '/admin' : '/my-books');
    navigate(redirectPath);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <img
            src={logoImg}
            alt="DanumaLK Logo"
            className="w-14 h-14 rounded-2xl object-contain bg-white mx-auto shadow-md border border-slate-100 p-1"
          />
          <h1 className="text-2xl font-extrabold text-navy-950 tracking-tight">
            {isAdminRequested ? 'Librarian & Admin Portal Sign In' : 'Sign In to DanumaLK'}
          </h1>
          <p className="text-xs text-slate-500">
            {isAdminRequested
              ? 'Please authenticate with administrative privileges to manage library operations'
              : 'Access your borrowing history and saved books'}
          </p>
        </div>

        {/* Admin Access Required Banner */}
        {isAdminRequested && (
          <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-3.5 flex items-center gap-3 text-xs text-amber-900 shadow-2xs animate-in fade-in slide-in-from-top-1">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">Staff Authentication Required</p>
              <p className="text-[11px] text-amber-700">
                You must sign in as an Administrator/Librarian to view the Admin Dashboard.
              </p>
            </div>
          </div>
        )}

        {/* Regular Login Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
          {/* Role selector pill */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Select Demo Role
            </label>
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => {
                  setRole('member');
                  setEmail(DEMO_MEMBER.email);
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  role === 'member'
                    ? 'bg-white text-navy-900 shadow-2xs'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                Library Member
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('admin');
                  setEmail(DEMO_ADMIN.email);
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  role === 'admin'
                    ? 'bg-navy-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                Librarian / Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-navy-900 block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                  errors.email ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
                } focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all`}
              />
              {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-navy-900">Password</label>
                <span className="text-[10px] text-slate-400">Demo (any 6+ chars)</span>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                  errors.password ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
                } focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all`}
              />
              {errors.password && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              Sign In to Account
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500">
            Don't have a library membership yet?{' '}
            <Link to="/register" className="font-bold text-brand-600 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
