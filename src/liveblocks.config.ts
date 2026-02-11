import { createClient, LiveList } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const publicKey = process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY || "pk_dev_placeholder";

const client = createClient({
  publicApiKey: publicKey,
  throttle: 16,
});

export type Stroke = {
  id: string;
  points: number[];
  color: string;
  size: number;
};

export type StickyNote = {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  width: number;
  height: number;
};

type Presence = {
  cursor: { x: number; y: number } | null;
  name: string;
  color: string;
};

type Storage = {
  strokes: LiveList<Stroke>;
  notes: LiveList<StickyNote>;
  undoStack: LiveList<string>;
};

export const {
  RoomProvider,
  useOthers,
  useUpdateMyPresence,
  useMyPresence,
  useSelf,
  useStorage,
  useMutation,
  useHistory,
  useBroadcastEvent,
  useEventListener,
} = createRoomContext<Presence, Storage>(client);
