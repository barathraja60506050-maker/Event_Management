import React from 'react';
import { motion } from 'framer-motion';

export default function DashboardCards({ cards }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="glass-panel shadow-glass rounded-xl2 p-5 flex flex-col gap-2"
        >
          <span className="h-9 w-9 rounded-lg bg-aurora-gradient-soft flex items-center justify-center text-aurora-violet dark:text-aurora-cyan">
            {card.icon}
          </span>
          <span className="text-2xl font-display font-bold">{card.value}</span>
          <span className="text-sm text-ink-muted">{card.label}</span>
        </motion.div>
      ))}
    </div>
  );
}
