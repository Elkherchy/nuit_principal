"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import HiddenSnakeGame from "./HiddenSnakeGame";

const SECRET_WORD = "snake";

export function SnakeEasterEgg() {
  const [open, setOpen] = useState(false);
  const [triggerLabel, setTriggerLabel] = useState<string>();
  const bufferRef = useRef("");

  const openGame = useCallback((label: string) => {
    setTriggerLabel(label);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (!/^[a-zA-Z]$/.test(event.key)) {
        bufferRef.current = "";
        return;
      }
      bufferRef.current = (bufferRef.current + event.key.toLowerCase()).slice(-SECRET_WORD.length);
      if (bufferRef.current === SECRET_WORD) {
        openGame('Mot-clé "snake"');
        bufferRef.current = "";
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, openGame]);

  useEffect(() => {
    window.hiddenSnake = () => openGame("Console secret");
    return () => {
      delete window.hiddenSnake;
    };
  }, [openGame]);

  return (
    <HiddenSnakeGame
      open={open}
      triggerLabel={triggerLabel}
      onClose={handleClose}
    />
  );
}

export default SnakeEasterEgg;


