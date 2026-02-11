"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Pencil,
  StickyNote,
  MousePointer2,
  Undo2,
  Redo2,
  Trash2,
  Moon,
  Sun,
  Sparkles,
  Share2,
  Check,
} from "lucide-react";

type Tool = "draw" | "note" | "select";

interface ToolbarProps {
  tool: Tool;
  setTool: (t: Tool) => void;
  color: string;
  setColor: (c: string) => void;
  brushSize: number;
  setBrushSize: (s: number) => void;
  darkMode: boolean;
  setDarkMode: (d: boolean) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onAI: () => void;
  shareUrl: string;
}

const COLORS = ["#2563EB", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#1A1A1A", "#FFFDF8"];

export default function Toolbar({
  tool, setTool, color, setColor, brushSize, setBrushSize,
  darkMode, setDarkMode, onUndo, onRedo, onClear, onAI, shareUrl,
}: ToolbarProps) {
  const [copied, setCopied] = useState(false);

  const copyShare = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const btn = (active: boolean) =>
    `p-2 rounded-lg transition-all ${active ? "bg-brand text-white shadow-md" : "hover:bg-black/10 dark:hover:bg-white/10"}`;

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-3 py-2 rounded-2xl bg-white/90 dark:bg-dark/90 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-xl"
    >
      {/* Tools */}
      <button className={btn(tool === "select")} onClick={() => setTool("select")} title="Select">
        <MousePointer2 size={18} />
      </button>
      <button className={btn(tool === "draw")} onClick={() => setTool("draw")} title="Draw">
        <Pencil size={18} />
      </button>
      <button className={btn(tool === "note")} onClick={() => setTool("note")} title="Add Note">
        <StickyNote size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      {/* Colors */}
      <div className="flex gap-1">
        {COLORS.map((c) => (
          <button
            key={c}
            className={`w-5 h-5 rounded-full border-2 transition-transform ${color === c ? "border-brand scale-125" : "border-transparent"}`}
            style={{ backgroundColor: c }}
            onClick={() => setColor(c)}
          />
        ))}
      </div>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      {/* Brush Size */}
      <input
        type="range"
        min={1}
        max={20}
        value={brushSize}
        onChange={(e) => setBrushSize(Number(e.target.value))}
        className="w-16 accent-brand"
      />

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      {/* Actions */}
      <button className={btn(false)} onClick={onUndo} title="Undo"><Undo2 size={18} /></button>
      <button className={btn(false)} onClick={onRedo} title="Redo"><Redo2 size={18} /></button>
      <button className={btn(false)} onClick={onClear} title="Clear"><Trash2 size={18} /></button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      {/* AI */}
      <button className={`${btn(false)} text-brand`} onClick={onAI} title="AI Features">
        <Sparkles size={18} />
      </button>

      {/* Share */}
      <button className={btn(false)} onClick={copyShare} title="Copy share link">
        {copied ? <Check size={18} className="text-green-500" /> : <Share2 size={18} />}
      </button>

      {/* Dark Mode */}
      <button className={btn(false)} onClick={() => setDarkMode(!darkMode)} title="Toggle dark mode">
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </motion.div>
  );
}
