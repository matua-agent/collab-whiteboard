"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { motion, AnimatePresence } from "framer-motion";
import {
  useOthers,
  useUpdateMyPresence,
  useStorage,
  useMutation,
  useHistory,
  useSelf,
} from "@/liveblocks.config";
import type { Stroke, StickyNote } from "@/liveblocks.config";
import Toolbar from "./Toolbar";
import Cursors from "./Cursors";
import StickyNoteComponent from "./StickyNoteComp";
import AIPanel from "./AIPanel";

type Tool = "draw" | "note" | "select";

export default function Whiteboard({ roomId }: { roomId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>("draw");
  const [color, setColor] = useState("#2563EB");
  const [brushSize, setBrushSize] = useState(3);
  const [darkMode, setDarkMode] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<number[]>([]);
  const [editingNote, setEditingNote] = useState<string | null>(null);

  const updateMyPresence = useUpdateMyPresence();
  const history = useHistory();
  const strokes = useStorage((root) => root.strokes);
  const notes = useStorage((root) => root.notes);
  const self = useSelf();

  // Dark mode toggle
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Redraw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !strokes) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const stroke of strokes) {
      if (stroke.points.length < 4) continue;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(stroke.points[0], stroke.points[1]);
      for (let i = 2; i < stroke.points.length; i += 2) {
        ctx.lineTo(stroke.points[i], stroke.points[i + 1]);
      }
      ctx.stroke();
    }

    // Draw current stroke being drawn
    if (currentPoints.length >= 4) {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(currentPoints[0], currentPoints[1]);
      for (let i = 2; i < currentPoints.length; i += 2) {
        ctx.lineTo(currentPoints[i], currentPoints[i + 1]);
      }
      ctx.stroke();
    }
  }, [strokes, currentPoints, color, brushSize]);

  // Window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const addStroke = useMutation(({ storage }, stroke: Stroke) => {
    storage.get("strokes").push(stroke);
  }, []);

  const addNote = useMutation(({ storage }, note: StickyNote) => {
    storage.get("notes").push(note);
  }, []);

  const updateNote = useMutation(({ storage }, id: string, updates: Partial<StickyNote>) => {
    const notesList = storage.get("notes");
    const arr = notesList.toArray();
    const idx = arr.findIndex((n: StickyNote) => n.id === id);
    if (idx !== -1) {
      const current = arr[idx];
      notesList.set(idx, { ...current, ...updates });
    }
  }, []);

  const deleteNote = useMutation(({ storage }, id: string) => {
    const notesList = storage.get("notes");
    const arr = notesList.toArray();
    const idx = arr.findIndex((n: StickyNote) => n.id === id);
    if (idx !== -1) notesList.delete(idx);
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (tool === "draw") {
        setIsDrawing(true);
        setCurrentPoints([e.clientX, e.clientY]);
        history.pause();
      } else if (tool === "note") {
        const NOTE_COLORS = ["#FFEAA7", "#FF6B6B", "#4ECDC4", "#DDA0DD", "#98D8C8", "#F7DC6F"];
        addNote({
          id: nanoid(),
          x: e.clientX - 75,
          y: e.clientY - 50,
          text: "",
          color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
          width: 150,
          height: 100,
        });
        setTool("select");
      }
    },
    [tool, addNote, history]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      updateMyPresence({ cursor: { x: e.clientX, y: e.clientY } });
      if (isDrawing && tool === "draw") {
        setCurrentPoints((prev) => [...prev, e.clientX, e.clientY]);
      }
    },
    [isDrawing, tool, updateMyPresence]
  );

  const handlePointerUp = useCallback(() => {
    if (isDrawing && currentPoints.length >= 4) {
      addStroke({
        id: nanoid(),
        points: currentPoints,
        color,
        size: brushSize,
      });
      history.resume();
    }
    setIsDrawing(false);
    setCurrentPoints([]);
  }, [isDrawing, currentPoints, addStroke, color, brushSize, history]);

  const handlePointerLeave = useCallback(() => {
    updateMyPresence({ cursor: null });
    if (isDrawing) {
      handlePointerUp();
    }
  }, [updateMyPresence, isDrawing, handlePointerUp]);

  const clearBoard = useMutation(({ storage }) => {
    const s = storage.get("strokes");
    while (s.length > 0) s.delete(0);
    const n = storage.get("notes");
    while (n.length > 0) n.delete(0);
  }, []);

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}?room=${roomId}`
    : "";

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ cursor: tool === "draw" ? "crosshair" : tool === "note" ? "cell" : "default" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
      />

      {/* Sticky Notes */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {notes?.map((note: StickyNote) => (
          <StickyNoteComponent
            key={note.id}
            note={note}
            isEditing={editingNote === note.id}
            onEdit={() => setEditingNote(note.id)}
            onBlur={() => setEditingNote(null)}
            onUpdate={(updates) => updateNote(note.id, updates)}
            onDelete={() => deleteNote(note.id)}
          />
        ))}
      </div>

      {/* Cursors */}
      <Cursors />

      {/* Toolbar */}
      <Toolbar
        tool={tool}
        setTool={setTool}
        color={color}
        setColor={setColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onUndo={() => history.undo()}
        onRedo={() => history.redo()}
        onClear={clearBoard}
        onAI={() => setShowAI(!showAI)}
        shareUrl={shareUrl}
      />

      {/* AI Panel */}
      <AnimatePresence>
        {showAI && notes && (
          <AIPanel notes={notes.map((n: StickyNote) => ({ id: n.id, text: n.text }))} onClose={() => setShowAI(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
