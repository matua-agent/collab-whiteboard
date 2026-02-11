"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ListTree, FileText, X, Loader2 } from "lucide-react";

interface Props {
  notes: { id: string; text: string }[];
  onClose: () => void;
}

export default function AIPanel({ notes, onClose }: Props) {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const callAI = async (action: "organize" | "summarize") => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, notes }),
      });
      const data = await res.json();
      setResult(data.result);
    } catch {
      setResult("Failed to call AI. Check your connection.");
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="absolute right-4 top-20 z-50 w-80 max-h-[70vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-brand font-semibold">
          <Sparkles size={18} /> AI Features
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <X size={16} />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <p className="text-xs text-gray-500">
          {notes.length} note{notes.length !== 1 ? "s" : ""} on the board
        </p>

        <button
          onClick={() => callAI("organize")}
          disabled={loading || notes.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium"
        >
          <ListTree size={16} /> Organize Notes
        </button>

        <button
          onClick={() => callAI("summarize")}
          disabled={loading || notes.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium"
        >
          <FileText size={16} /> Summarize Board
        </button>
      </div>

      {(loading || result) && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 size={16} className="animate-spin" /> Thinking...
            </div>
          ) : (
            <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{result}</div>
          )}
        </div>
      )}
    </motion.div>
  );
}
