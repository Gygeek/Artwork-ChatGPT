import React, { useEffect, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import artworkManifest from "./artwork.json";

const TRANSITION_DELAY = 3000; // 3 seconds

function App() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!paused) {
      timerRef.current = setTimeout(() => {
        setIndex((prev) => (prev + 1) % artworkManifest.length);
      }, TRANSITION_DELAY);
    }
  };

  const handleActivity = () => {
    setPaused(true);
    clearTimeout(timerRef.current);
    // Resume after 5s of inactivity
    setTimeout(() => setPaused(false), 5000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      setIndex((prev) => (prev + 1) % artworkManifest.length);
    } else if (e.key === "ArrowLeft") {
      setIndex((prev) => (prev - 1 + artworkManifest.length) % artworkManifest.length);
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    resetTimer();
    return () => clearTimeout(timerRef.current);
  }, [index, paused]);

  return (
    <div
      style={{
        overflow: "hidden",
        backgroundColor: "black",
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={artworkManifest[index].src}
          src={artworkManifest[index].src}
          alt="Artwork"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{
            objectFit: "contain",
            maxHeight: "100vh",
            maxWidth: "100vw",
            width: "100%",
            height: "100%",
          }}
        />
      </AnimatePresence>

      {/* 
      <div style={{
        position: "absolute",
        bottom: 20,
        left: 20,
        color: "white",
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: "10px",
        borderRadius: "8px",
      }}>
        {artworkManifest[index].description}
      </div>
      */}
    </div>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
