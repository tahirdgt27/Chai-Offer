/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coffee, Heart, Sparkles, PartyPopper } from 'lucide-react';

export default function App() {
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [isAccepted, setIsAccepted] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const moveNoButton = () => {
    if (!containerRef.current) return;

    const btnWidth = 100;
    const btnHeight = 50;
    const padding = 20;

    const maxX = containerSize.width - btnWidth - padding;
    const maxY = containerSize.height - btnHeight - padding;

    // Generate random position
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;

    setNoButtonPos({ x: newX, y: newY });
  };

  const handleYesClick = () => {
    setIsAccepted(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#FF6321] flex flex-col items-center justify-center overflow-hidden p-4 font-sans selection:bg-black selection:text-[#FF6321]"
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-10 left-10 rotate-12">
          <Coffee size={120} />
        </div>
        <div className="absolute bottom-20 right-10 -rotate-12">
          <Coffee size={160} />
        </div>
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 opacity-20">
          <Sparkles size={200} />
        </div>
      </div>

      <audio 
        ref={audioRef} 
        src="https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3" 
        preload="auto"
      />

      <AnimatePresence mode="wait">
        {!isAccepted ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="z-10 text-center"
          >
            <motion.div
              animate={{ 
                rotate: [0, -5, 5, -5, 0],
                y: [0, -10, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="mb-8 inline-block"
            >
              <Coffee size={80} className="text-black" />
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-black text-black uppercase tracking-tighter leading-none mb-12">
              CHAI PILA <br /> RAHAY HO?
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 min-h-[100px]">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleYesClick}
                className="px-12 py-4 bg-black text-[#FF6321] text-2xl font-bold rounded-full shadow-2xl hover:shadow-black/40 transition-shadow cursor-pointer z-20"
              >
                YES!
              </motion.button>

              <motion.button
                animate={{ 
                  x: noButtonPos.x ? noButtonPos.x - (containerSize.width / 2) + 50 : 0, 
                  y: noButtonPos.y ? noButtonPos.y - (containerSize.height / 2) + 150 : 0 
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onMouseEnter={moveNoButton}
                onTouchStart={moveNoButton}
                className="px-12 py-4 border-4 border-black text-black text-2xl font-bold rounded-full cursor-default pointer-events-auto"
              >
                NO
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="z-10 text-center flex flex-col items-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="mb-6"
            >
              <PartyPopper size={100} className="text-black" />
            </motion.div>
            
            <h2 className="text-6xl md:text-8xl font-black text-black uppercase tracking-tighter leading-none mb-4">
              SHUKRIYA!
            </h2>
            <p className="text-2xl font-bold text-black/80 uppercase tracking-widest">
              I'm coming for the chai! ☕️
            </p>

            <motion.div 
              className="mt-12 flex gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: { y: 0, opacity: 1 }
                  }}
                >
                  <Heart className="text-black fill-black" size={32} />
                </motion.div>
              ))}
            </motion.div>

            <button 
              onClick={() => setIsAccepted(false)}
              className="mt-16 text-black/60 hover:text-black font-bold uppercase tracking-tighter text-sm underline underline-offset-4"
            >
              Ask again?
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating particles for fun */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-black/5"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              rotate: Math.random() * 360
            }}
            animate={{ 
              y: [null, "-100%"],
              rotate: [null, Math.random() * 360 + 360]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            <Coffee size={Math.random() * 40 + 20} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
