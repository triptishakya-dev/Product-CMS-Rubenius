"use client";

import React from "react";

const HomeHero = () => {
  return (
    <div className="relative w-full h-[60vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-gray-100">

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        <p className="font-dm text-sm md:text-base font-medium tracking-tight" style={{ color: "#4BA541" }}>
          Rubenius — The Interior Wellbeing Co.
        </p>
        
        <h1 className="font-dm text-3xl md:text-7xl font-black text-black leading-[1.1] tracking-tight">
          Enriching lives through <br className="hidden md:block" /> honest design.
        </h1>
        
        <div className="pt-8">
          <p className="font-dm text-sm md:text-base max-w-3xl mx-auto leading-relaxed text-gray-400 font-medium">
            We believe that healthy and happy living is possible only when there is both balance and harmony in our lives. 
            We aim to create the best work and living environments possible for our clients.
          </p>
        </div>
      </div>

      {/* Subtle border bottom */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gray-100" />
    </div>
  );
};

export default HomeHero;
