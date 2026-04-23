"use client";

import dynamic from "next/dynamic";

const PaintCanvas = dynamic(() => import("@/components/PaintCanvas"), {
  ssr: false,
});

export default function LazyPaintCanvas() {
  return <PaintCanvas />;
}
