import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Copy, CheckCircle2, AlertCircle } from 'lucide-react';
import TreeView from './components/TreeView';
import SummaryCards from './components/SummaryCards';
import CycleWarning from './components/CycleWarning';
import GraphVisualizer from './components/GraphVisualizer';

const getInvalidReason = (entry) => {
  if (typeof entry !== 'string' || entry === '') return "Empty string";
  
  const trimmed = entry.trim();
  if (trimmed === '') return "Empty string";
  
  if (trimmed.length === 3 && trimmed[1] === '-' && !trimmed.includes('>')) return "Wrong separator";
  
  if (!trimmed.includes('->')) return "Not a node format";
  
  const parts = trimmed.split('->');
  if (parts.length !== 2) return "Not a node format";
  
  const parent = parts[0];
  const child = parts[1];
  
  if (parent === '' && child === '') return "Missing parent and child nodes";
  if (parent === '') return "Missing parent node";
  if (child === '') return "Missing child node";
  
  if (parent.length > 1 || child.length > 1) return "Multi-character parent";
  
  const isUpper = (str) => /^[A-Z]$/.test(str);
  if (!isUpper(parent) || !isUpper(child)) return "Not uppercase letters";
  
  if (parent === child) return "Self-loop";
  
  return "Invalid format";
};

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return <div className="p-4 bg-red-900/50 text-red-200 border border-red-500 rounded-lg"><h2>Graph Crash!</h2><pre>{this.state.error.toString()}</pre></div>;
    }
    return this.props.children;
  }
}

function App() {
  const [input, setInput] = useState('["A->B", "A->C", "B->D", "C->E", "E->F", "X->Y", "Y->Z", "Z->X", "hello"]');
  const [userId, setUserId] = useState('johndoe_17091999');
  const [emailId, setEmailId] = useState('john.doe@college.edu');
  const [rollNumber, setRollNumber] = useState('21CS1001');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Parse input safely
      let parsedData;
      try {
        const parsed = JSON.parse(input);
        if (Array.isArray(parsed)) {
            parsedData = parsed;
        } else if (parsed && Array.isArray(parsed.data)) {
            parsedData = parsed.data;
        } else {
            throw new Error("Invalid format");
        }
      } catch {
        // Fallback: try to split by comma if not valid JSON
        parsedData = input.split(',').map(s => s.trim().replace(/['"\[\]\{\}]/g, '')).filter(Boolean);
      }

      const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const payload = { data: parsedData };
      if (userId.trim()) payload.user_id = userId.trim();
      if (emailId.trim()) payload.email_id = emailId.trim();
      if (rollNumber.trim()) payload.college_roll_number = rollNumber.trim();

      const response = await axios.post(`${API_URL}/bfhl`, payload);
      setRawData(parsedData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 mb-4"
          >
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
          >
            Hierarchy <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Analyzer</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto"
          >
            SRM Full Stack Engineering Challenge
          </motion.p>
        </div>

        {/* Input Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-2xl p-6 sm:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">User ID</label>
                <input
                  type="text"
                  className="glass-input block w-full rounded-xl p-3 text-slate-200 text-sm"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="fullname_ddmmyyyy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email ID</label>
                <input
                  type="email"
                  className="glass-input block w-full rounded-xl p-3 text-slate-200 text-sm"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  placeholder="john@college.edu"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Roll Number</label>
                <input
                  type="text"
                  className="glass-input block w-full rounded-xl p-3 text-slate-200 text-sm"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="21CS1001"
                />
              </div>
            </div>

            <div>
              <label htmlFor="nodes" className="block text-sm font-medium text-slate-300 mb-2">
                Node Relationships Input (JSON Array or Comma Separated)
              </label>
              <div className="relative">
                <textarea
                  id="nodes"
                  rows={4}
                  className="glass-input block w-full rounded-xl p-4 text-slate-200 font-mono text-sm resize-none"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder='["A->B", "A->C", "B->D"]'
                  spellCheck="false"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="-ml-1 mr-2 h-5 w-5" />
                    Analyze Graph
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-panel border-red-500/30 bg-red-500/5 rounded-2xl p-4 flex items-start gap-3"
            >
              <AlertCircle className="text-red-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-400 font-medium">Analysis Failed</h3>
                <p className="text-slate-400 text-sm mt-1">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <SummaryCards summary={result.summary} />

              {/* User Info & Badges */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-1.5 text-sm">
                    <span className="text-slate-400">User: </span>
                    <span className="text-slate-200 font-medium">{result.user_id}</span>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-1.5 text-sm">
                    <span className="text-slate-400">Email: </span>
                    <span className="text-slate-200 font-medium">{result.email_id}</span>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-1.5 text-sm">
                    <span className="text-slate-400">Roll: </span>
                    <span className="text-slate-200 font-medium">{result.college_roll_number}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center px-3 py-1.5 border border-slate-600 rounded-lg text-sm text-slate-300 hover:bg-slate-800 focus:outline-none transition-colors"
                >
                  {copied ? <CheckCircle2 size={16} className="mr-2 text-emerald-400" /> : <Copy size={16} className="mr-2" />}
                  {copied ? 'Copied JSON' : 'Copy JSON'}
                </button>
              </div>

              {/* Warnings (Invalid & Duplicates) */}
              {(result.invalid_entries?.length > 0 || result.duplicate_edges?.length > 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.invalid_entries?.length > 0 && (
                    <div className="glass-panel border-rose-500/20 p-4 rounded-xl">
                      <h4 className="text-rose-400 text-sm font-semibold mb-2 flex items-center gap-2">
                        <AlertCircle size={16} /> Invalid Entries & Reasons
                      </h4>
                      <div className="flex flex-col gap-2">
                        {result.invalid_entries.map((entry, idx) => (
                          <div key={idx} className="bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs px-2 py-1.5 rounded flex justify-between items-center gap-4">
                            <span className="font-mono bg-rose-900/50 px-1 rounded truncate max-w-[150px]" title={entry}>
                              {entry === "" ? '""' : entry}
                            </span>
                            <span className="text-rose-400/80 italic text-right">
                              {getInvalidReason(entry)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.duplicate_edges?.length > 0 && (
                    <div className="glass-panel border-amber-500/20 p-4 rounded-xl">
                      <h4 className="text-amber-400 text-sm font-semibold mb-2 flex items-center gap-2">
                        <AlertCircle size={16} /> Duplicate Edges (Ignored)
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.duplicate_edges.map((edge, idx) => (
                          <span key={idx} className="bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs px-2 py-1 rounded">
                            {edge}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Hierarchies */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-4">Generated Hierarchies</h3>
                {result.hierarchies?.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {result.hierarchies.map((hierarchy, index) => (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index }}
                        key={index}
                        className="h-full"
                      >
                        {hierarchy.has_cycle ? (
                          <CycleWarning hierarchy={hierarchy} />
                        ) : (
                          <TreeView hierarchy={hierarchy} />
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 glass-panel rounded-xl">
                    <p className="text-slate-400">No valid hierarchies could be constructed.</p>
                  </div>
                )}
              </div>

              {/* React Flow Interactive Graph */}
              <ErrorBoundary>
                <GraphVisualizer result={result} rawData={rawData} />
              </ErrorBoundary>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

export default App;
