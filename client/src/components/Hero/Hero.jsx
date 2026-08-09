import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight, HiSparkles } from 'react-icons/hi';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora-gradient-soft -z-10" />
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-aurora-gradient opacity-20 blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-20 pb-24 flex flex-col items-start">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full glass-panel mb-6"
        >
          <HiSparkles className="text-aurora-violet dark:text-aurora-cyan" /> QR tickets, generated the moment you register
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-display font-bold text-4xl sm:text-6xl leading-tight max-w-3xl"
        >
          Every event has a story.
          <br />
          <span className="bg-aurora-gradient bg-clip-text text-transparent">Yours starts with a ticket.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-5 text-lg text-ink-muted max-w-xl"
        >
          Discover meetups, conferences and workshops near you, register in seconds, and walk in with a QR ticket
          already in your pocket.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          <Link to="/events" className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold gradient-btn">
            Browse events <HiArrowRight />
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 rounded-full font-semibold border border-white/15 hover:border-aurora-violet/50 transition-colors"
          >
            Host your own event
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
