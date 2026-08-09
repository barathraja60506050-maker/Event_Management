import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { HiTicket } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setSubmitting(true);
    try {
      await register(form);
      toast.success('Account created — welcome to Eventra!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Could not create your account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-10">
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
          <h1 className="font-display font-bold text-xl">Create your account</h1>
        </div>

        {error && (
          <div className="mb-4 text-sm px-3 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            Full name
            <input
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Jordan Lee"
              className="px-4 py-2.5 rounded-lg bg-transparent border border-white/15 focus:border-aurora-violet outline-none"
            />
          </label>

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
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="At least 8 characters, with a number"
              className="px-4 py-2.5 rounded-lg bg-transparent border border-white/15 focus:border-aurora-violet outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 py-2.5 rounded-full font-semibold gradient-btn disabled:opacity-60"
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-sm text-ink-muted text-center">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-aurora-violet dark:text-aurora-cyan">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
