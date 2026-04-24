import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const CycleWarning = ({ hierarchy }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel p-4 rounded-xl border-amber-500/30 bg-amber-500/5 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-500/20 rounded-full text-amber-400">
          <AlertTriangle size={20} />
        </div>
        <div>
          <h3 className="text-amber-400 font-semibold text-lg flex items-center gap-2">
            Cycle Detected
            <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full border border-amber-500/30">
              Root: {hierarchy.root}
            </span>
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            A pure cycle was detected in this group. Nodes form a closed loop with no valid root. 
            The lexicographically smallest node ({hierarchy.root}) was assigned as the root.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CycleWarning;
