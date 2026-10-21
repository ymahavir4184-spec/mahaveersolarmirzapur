"use client";

import { useEffect } from "react";

const AUDIO_SOURCE = "/audio/mahaveer-enterprises-intro.mp3";

export default function SiteAudio() {
  useEffect(() => {
    let audio = null;
    let attemptPending = false;
    let playbackStarted = false;

    const startOnInteraction = () => {
      if (!audio) {
        audio = new Audio(AUDIO_SOURCE);
        audio.preload = "none";
        audio.volume = 1;
      }

      if (playbackStarted || attemptPending || !audio.paused) return;

      attemptPending = true;
      audio.play().then(() => {
        playbackStarted = true;
        removeInteractionListeners();
      }).catch(() => {
        // Mobile browsers may reject a play attempt; keep waiting for another tap.
        attemptPending = false;
      });
    };

    const removeInteractionListeners = () => {
      window.removeEventListener("pointerdown", startOnInteraction);
      window.removeEventListener("click", startOnInteraction);
      window.removeEventListener("keydown", startOnInteraction);
    };

    window.addEventListener("pointerdown", startOnInteraction);
    window.addEventListener("click", startOnInteraction);
    window.addEventListener("keydown", startOnInteraction);

    return () => {
      removeInteractionListeners();
      if (audio) {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      }
    };
  }, []);

  return null;
}
