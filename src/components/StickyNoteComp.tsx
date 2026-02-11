"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { StickyNote } from "@/liveblocks.config";

interface Props {
  note: StickyNote;
  isEditing: boolean;
  onEdit: () => void;
  onBlur: () => void;
  onUpdate: (updates: Partial<StickyNote>) => void;
  onDelete: () => void;
}

export default function StickyNoteComponent({ note, isEditing, onEdit, onBlur, onUpdate, onDelete }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, noteX: 0, noteY: 0 });

  const handleDragStart = useCallback(
    (e: React.PointerEvent) => {
      if (isEditing) return;
      setIsDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY, noteX: note.x, noteY: note.y };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [isEditing, note.x, note.y]
  );

  const handleDragMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      onUpdate({ x: dragStart.current.noteX + dx, y: dragStart.current.noteY + dy });
    },
    [isDragging, onUpdate]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      className="absolute pointer-events-auto group"
      style={{
        left: note.x,
        top: note.y,
        width: note.width,
        minHeight: note.height,
        zIndex: isDragging ? 100 : 20,
      }}
    >
      <div
        className="relative rounded-lg shadow-lg p-3 cursor-move"
        style={{ backgroundColor: note.color }}
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onDoubleClick={onEdit}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X size={12} />
        </button>
        {isEditing ? (
          <textarea
            autoFocus
            value={note.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            onBlur={onBlur}
            className="w-full h-full bg-transparent resize-none outline-none text-sm text-gray-800"
            style={{ minHeight: 60 }}
            onPointerDown={(e) => e.stopPropagation()}
          />
        ) : (
          <p className="text-sm text-gray-800 whitespace-pre-wrap min-h-[40px]">
            {note.text || "Double-click to edit..."}
          </p>
        )}
      </div>
    </motion.div>
  );
}
