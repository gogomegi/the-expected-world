"use client";

import { useRef, useEffect, useState } from "react";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [panPhase, setPanPhase] = useState(0); // 0=right, 1=center, 2=left

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});

    const onTimeUpdate = () => {
      if (!video.duration) return;
      const progress = video.currentTime / video.duration;
      if (progress < 1 / 3) {
        setPanPhase(0);
      } else if (progress < 2 / 3) {
        setPanPhase(1);
      } else {
        setPanPhase(2);
      }
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, []);

  // object-position: right man(0) → center woman(1) → left man(2)
  const positions = ["100% 50%", "50% 50%", "25% 50%"];

  return (
    <div className="hero-video-frame">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="hero-video"
        style={{
          objectPosition: positions[panPhase],
          transition: "object-position 1.8s ease-in-out",
        }}
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="hero-video-grain" />
    </div>
  );
}
