"use client";

import { useEffect } from "react";

const AUDIO_SOURCE = "/audio/mahaveer-enterprises-intro.mp3";

export default function SiteAudio() {
  useEffect(() => {
    let audio = null;

    const startOnInteraction = () => {
      window.removeEventListener("pointerdown", startOnInteraction);
      window.removeEventListener("keydown", startOnInteraction);

      if (!audio) {
        audio = new Audio(AUDIO_SOURCE);
        audio.preload = "none";
        audio.volume = 1;
      }
      if (audio.paused) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    };

    window.addEventListener("pointerdown", startOnInteraction);
    window.addEventListener("keydown", startOnInteraction);

    return () => {
      window.removeEventListener("pointerdown", startOnInteraction);
      window.removeEventListener("keydown", startOnInteraction);
      if (audio) {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      }
    };
  }, []);

  return null;
}
