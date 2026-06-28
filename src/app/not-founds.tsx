"use client"

import React, { useEffect, useRef } from 'react';

const NotFoundPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bouncingBoxRef = useRef<HTMLDivElement>(null);

  const position = useRef({ x: 50, y: 50 });
  const velocity = useRef({ dx: 2.5, dy: 2.5 }); // Smooth, moderate speed

  // Modern, vibrant colors that fit a clean UI (starting with your pink accent)
  const colors = [
    '#f472b6', // Pink (Matches your KnowMo. dot)
    '#8b5cf6', // Violet
    '#3b82f6', // Blue
    '#10b981', // Emerald
    '#f59e0b', // Amber
  ];

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      if (!containerRef.current || !bouncingBoxRef.current) return;

      const container = containerRef.current;
      const box = bouncingBoxRef.current;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const boxWidth = box.clientWidth;
      const boxHeight = box.clientHeight;

      let { x, y } = position.current;
      let { dx, dy } = velocity.current;
      let hitEdge = false;

      x += dx;
      y += dy;

      if (x + boxWidth >= containerWidth || x <= 0) {
        dx = -dx;
        x = x <= 0 ? 0 : containerWidth - boxWidth;
        hitEdge = true;
      }

      if (y + boxHeight >= containerHeight || y <= 0) {
        dy = -dy;
        y = y <= 0 ? 0 : containerHeight - boxHeight;
        hitEdge = true;
      }

      position.current = { x, y };
      velocity.current = { dx, dy };

      // Apply hardware-accelerated transform
      box.style.transform = `translate(${x}px, ${y}px)`;

      // Change colors smoothly on bounce
      if (hitEdge) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        box.style.backgroundColor = randomColor;
        box.style.boxShadow = `0 10px 25px -5px ${randomColor}60`; // Soft colored shadow
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        // Use a minimum height that accounts for your header, or just let it fill the view
        height: 'calc(100vh - 100px)', 
        backgroundColor: 'transparent', // Inherits your app's off-white background
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Fallback text in the center */}
      <div style={{
          position: 'absolute',
          textAlign: 'center',
          color: '#d1d5db', // Light gray
          fontFamily: 'Inter, system-ui, sans-serif',
          zIndex: 0
      }}>
          <h1 style={{ fontSize: '6rem', margin: 0, fontWeight: 800 }}>404</h1>
          <p style={{ fontSize: '1.25rem', margin: 0, fontWeight: 500 }}>Looks like you're lost.</p>
      </div>

      {/* The Bouncing Element */}
      <div
        ref={bouncingBoxRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          padding: '0.75rem 1.5rem',
          fontSize: '1.125rem',
          fontWeight: '600',
          fontFamily: 'Inter, system-ui, sans-serif',
          color: '#ffffff',
          backgroundColor: '#f472b6', // Initial pink color
          borderRadius: '9999px', // Pill shape matching your header navigation
          boxShadow: '0 10px 25px -5px #f472b660',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          cursor: 'pointer',
          willChange: 'transform, background-color, box-shadow',
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease', // Smooth color shifts
          zIndex: 10,
        }}
        onClick={() => window.history.back()}
        title="Click to go back"
      >
        Go Back
      </div>
    </div>
  );
};

export default NotFoundPage;