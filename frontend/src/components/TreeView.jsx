import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, File, Network } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TreeItem = ({ name, node, isRoot, defaultExpanded = true }) => {
  const hasChildren = node && Object.keys(node).length > 0;
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="select-none">
      <div 
        className={`flex items-center py-1.5 px-2 rounded-md transition-colors ${
          hasChildren ? 'cursor-pointer hover:bg-slate-800/50' : ''
        }`}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        <div className="w-5 flex items-center justify-center mr-1">
          {hasChildren ? (
            isExpanded ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />
          ) : (
            <span className="w-4" /> // spacer
          )}
        </div>
        
        <div className="mr-2 text-indigo-400">
          {isRoot ? (
            <Network size={18} className="text-emerald-400" />
          ) : hasChildren ? (
            <Folder size={16} className="text-indigo-400" />
          ) : (
            <File size={16} className="text-slate-400" />
          )}
        </div>
        
        <span className={`font-medium ${isRoot ? 'text-emerald-300 font-bold' : 'text-slate-300'}`}>
          {name}
        </span>
      </div>

      <AnimatePresence initial={false}>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="ml-6 border-l border-slate-700/50 pl-2">
              {Object.entries(node).map(([childName, childNode]) => (
                <TreeItem 
                  key={childName} 
                  name={childName} 
                  node={childNode} 
                  isRoot={false} 
                  defaultExpanded={defaultExpanded}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TreeView = ({ hierarchy }) => {
  return (
    <div className="glass-panel p-4 rounded-xl">
      <div className="flex justify-between items-center mb-4 border-b border-slate-700/50 pb-2">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-emerald-300">
          <Network size={20} />
          Root: {hierarchy.root}
        </h3>
        <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-1 rounded-full border border-indigo-500/30">
          Depth: {hierarchy.depth}
        </span>
      </div>
      <div className="pl-2">
        {hierarchy.tree && hierarchy.tree[hierarchy.root] ? (
          <TreeItem 
            name={hierarchy.root} 
            node={hierarchy.tree[hierarchy.root]} 
            isRoot={true} 
          />
        ) : (
          <div className="text-slate-500 italic text-sm">Empty Tree</div>
        )}
      </div>
    </div>
  );
};

export default TreeView;
