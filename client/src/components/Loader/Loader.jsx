import React from 'react';
import { motion } from 'framer-motion';

export default function Loader({ label = 'Loading', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.div
        className="h-10 w-10 rounded-full border-2 border-transparent"
        style={{
          borderTopColor: '#7C3AED',
          borderRightColor: '#06B6D4',
        }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
      />
      {label && <p className="text-sm text-ink-muted">{label}…</p>}
    </div>
  );

  if (fullScreen) {
    return <div className="min-h-[60vh] flex items-center justify-center">{content}</div>;
  }

  return content;
}
