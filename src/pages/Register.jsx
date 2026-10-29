import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.jpg';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BookOpen, UserPlus, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export const Register = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    agreeTerms: true
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please provide a valid email format.';
    }
    if (!formData.phone.trim()) errs.phone = 'Phone number is required.';
    if (formData.password.length < 6) errs.password = 'Password must contain at least 6 characters.';
    if (!formData.agreeTerms) errs.agreeTerms = 'You must accept the library terms.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await register(formData);
      showToast(`Welcome to AuraLib LK, ${formData.name}! Your digital card has been issued.`, 'success');
      navigate('/my-books');
    } catch (error) { showToast(error.message || 'Unable to create your account.', 'error'); }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <img
            src={logoImg}
            alt="AuraLib LK Logo"
            className="w-14 h-14 rounded-2xl object-contain bg-white mx-auto shadow-md border border-slate-100 p-1"
          />
          <h1 className="text-2xl font-extrabold text-navy-950 tracking-tight">
            Apply for AuraLib LK Membership
          </h1>
          <p className="text-xs text-slate-500">
            Get instant access to thousands of books and borrowing privileges
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-navy-900 block mb-1">Full Legal Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Kasun Perera"
                className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                  errors.name ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
                } focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500`}
              />
              {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-navy-900 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="kasun@example.lk"
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                    errors.email ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
                  } focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500`}
                />
                {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-navy-900 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+94 (77) 123-4567"
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                    errors.phone ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
                  } focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500`}
                />
                {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-navy-900 block mb-1">Password</label>
              <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="At least 6 characters" className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${errors.password ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500`} />
              {errors.password && <p className="text-[11px] text-rose-500 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-navy-900 block mb-1">
                Residential Street Address (Optional)
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="45/2 Galle Road, Bambalapitiya, Colombo 04"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                className="mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <label htmlFor="terms" className="text-xs text-slate-600 leading-snug">
                I agree to the AuraLib Library Public Borrower Code of Conduct and acknowledge standard 14-day borrowing loan policies.
              </label>
            </div>
            {errors.agreeTerms && (
              <p className="text-[11px] text-rose-500">{errors.agreeTerms}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-4"
            >
              <UserPlus className="w-4 h-4" />
              Complete Membership Application
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500">
            Already registered as a member?{' '}
            <Link to="/login" className="font-bold text-brand-600 hover:underline">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
