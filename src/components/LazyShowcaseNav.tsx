"use client";

import dynamic from "next/dynamic";

const ShowcaseNav = dynamic(() => import("@/components/ShowcaseNav"), {
  ssr: false,
});

export default function LazyShowcaseNav() {
  return <ShowcaseNav />;
}
