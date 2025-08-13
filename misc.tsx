import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";

export default function FlipCardDemo() {
  const [flipped, setFlipped] = useState(false);
  const controls = useAnimation();

  const handleClick = async () => {
    const goingTo = !flipped;
    setFlipped(goingTo);

    // Démarre le déplacement (seul)
    controls.start({
      x: goingTo ? 200 : -200,
      transition: { duration: 0.6, ease: "easeInOut" },
    });

    // Lancer uniquement le flip, sans interrompre x
    setTimeout(() => {
      controls.start({
        rotateY: goingTo ? 180 : 0,
        transition: { duration: 0.1, ease: "easeInOut" },
      });
    }, 150); // Flip à mi-chemin
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f0f0f0"
    }}>
      <div style={{ perspective: "1000px" }}>
        <motion.div
          animate={controls}
          style={{
            width: 200,
            height: 120,
            borderRadius: 16,
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            position: "relative",
            cursor: "pointer",
            background: "transparent",
            transformStyle: "preserve-3d",
          }}
          onClick={handleClick}
        >
          {/* Face avant */}
          <div style={{
            background: "#47cf73",
            color: "#222",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            fontWeight: "bold",
            width: "100%",
            height: "100%",
            borderRadius: 16,
            backfaceVisibility: "hidden",
            position: "absolute",
            top: 0,
            left: 0,
          }}>
            Face visible
          </div>

          {/* Face arrière */}
          <div style={{
            background: "#1b1b1b",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            fontWeight: "bold",
            width: "100%",
            height: "100%",
            borderRadius: 16,
            backfaceVisibility: "hidden",
            position: "absolute",
            top: 0,
            left: 0,
            transform: "rotateY(180deg)",
          }}>
            Face cachée
          </div>
        </motion.div>
      </div>
    </div>
  );
}
