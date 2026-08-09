import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { HiTicket, HiEye, HiEyeOff } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const loggedInUser = await login(form);
      toast.success('Welcome back!');

      const defaultDestination = loggedInUser.role === 'admin' ? '/admin' : '/dashboard';
      const destination = from && from !== '/login' && from !== '/register' ? from : defaultDestination;

      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || 'Could not log in');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md glass-panel shadow-glass rounded-xl2 p-8"
      >
        <div className="flex items-center gap-2 mb-6">
          <span className="h-9 w-9 rounded-lg bg-aurora-gradient flex items-center justify-center text-white">
            <HiTicket />
          </span>
          <h1 className="font-display font-bold text-xl">Welcome back</h1>
        </div>

        {error && (
          <div className="mb-4 text-sm px-3 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            Email
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="px-4 py-2.5 rounded-lg bg-transparent border border-white/15 focus:border-aurora-violet outline-none"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            Password
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg bg-transparent border border-white/15 focus:border-aurora-violet outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <HiEyeOff /> : <HiEye />}
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 py-2.5 rounded-full font-semibold gradient-btn disabled:opacity-60"
          >
            {submitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-sm text-ink-muted text-center">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-aurora-violet dark:text-aurora-cyan">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
