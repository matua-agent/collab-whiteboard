"use client";

import { useOthers } from "@/liveblocks.config";

export default function Cursors() {
  const others = useOthers();

  return (
    <div className="absolute inset-0 z-40 pointer-events-none">
      {others.map(({ connectionId, presence }) => {
        if (!presence?.cursor) return null;
        return (
          <div
            key={connectionId}
            className="absolute transition-transform duration-75"
            style={{
              left: presence.cursor.x,
              top: presence.cursor.y,
              transform: "translate(-2px, -2px)",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill={presence.color || "#2563EB"}>
              <path d="M5.65 2.65L18.15 12.15L12.15 13.15L9.65 19.65L5.65 2.65Z" />
            </svg>
            <span
              className="absolute left-4 top-4 px-2 py-0.5 rounded-full text-xs text-white whitespace-nowrap"
              style={{ backgroundColor: presence.color || "#2563EB" }}
            >
              {presence.name || "Anonymous"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
