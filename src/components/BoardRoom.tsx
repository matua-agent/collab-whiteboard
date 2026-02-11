"use client";

import { LiveList } from "@liveblocks/client";
import { RoomProvider } from "@/liveblocks.config";
import Whiteboard from "./Whiteboard";

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F"];

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function randomName() {
  const adjectives = ["Swift", "Clever", "Bold", "Calm", "Bright", "Lucky"];
  const animals = ["Fox", "Owl", "Bear", "Wolf", "Hawk", "Deer"];
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${animals[Math.floor(Math.random() * animals.length)]}`;
}

export default function BoardRoom({ roomId }: { roomId: string }) {
  return (
    <RoomProvider
      id={roomId}
      initialPresence={{ cursor: null, name: randomName(), color: randomColor() }}
      initialStorage={{ strokes: new LiveList([]), notes: new LiveList([]), undoStack: new LiveList([]) }}
    >
      <Whiteboard roomId={roomId} />
    </RoomProvider>
  );
}
