"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { nanoid } from "nanoid";
import BoardRoom from "@/components/BoardRoom";

function BoardLoader() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("room") || "default-room";
  return <BoardRoom roomId={roomId} />;
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-lg">Loading board...</div>}>
      <BoardLoader />
    </Suspense>
  );
}
