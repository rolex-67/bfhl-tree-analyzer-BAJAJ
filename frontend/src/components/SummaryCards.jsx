import React from 'react';
import { GitCommit, AlertTriangle, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

const Card = ({ title, value, icon: Icon, colorClass, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="glass-panel p-5 rounded-xl flex items-center gap-4"
  >
    <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10 border border-current`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm text-slate-400 font-medium">{title}</p>
      <p className="text-2xl font-bold text-slate-100">{value !== null && value !== undefined ? value : 'N/A'}</p>
    </div>
  </motion.div>
);

const SummaryCards = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card 
        title="Total Trees" 
        value={summary.total_trees} 
        icon={GitCommit} 
        colorClass="text-emerald-400"
        delay={0.1}
      />
      <Card 
        title="Total Cycles" 
        value={summary.total_cycles} 
        icon={AlertTriangle} 
        colorClass="text-amber-400"
        delay={0.2}
      />
      <Card 
        title="Largest Tree Root" 
        value={summary.largest_tree_root} 
        icon={Crown} 
        colorClass="text-indigo-400"
        delay={0.3}
      />
    </div>
  );
};

export default SummaryCards;
