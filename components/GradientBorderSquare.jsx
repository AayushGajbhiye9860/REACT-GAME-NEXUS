import React from 'react';

const GradientBorderSquare = () => {
  return (
    <div
      className="relative flex items-center justify-center w-full max-w-[300px] aspect-square p-[4px] bg-transparent overflow-hidden"
      style={{
        background: 'linear-gradient(to right, #FF1493, #9D4EDD, #00D9FF)',
        boxShadow: '0px 0px 20px rgba(255, 20, 147, 0.6)',
      }}
    >
      <div
        className="w-full h-full bg-[#0a0a0a] flex items-center justify-center"
        style={{
          // Optional: Add a subtle CRT scanline effect or retro texture if desired
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
          backgroundSize: '100% 2px, 3px 100%',
        }}
      >
        {/* Interior Content Placeholder */}
        <span className="text-[#FF1493] font-mono text-4xl font-bold tracking-tighter uppercase opacity-80 animate-pulse">
          GX
        </span>
      </div>
    </div>
  );
};

export default GradientBorderSquare;
