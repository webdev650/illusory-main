'use client';

import React, { useRef, useState, useEffect } from 'react';

interface EnhancedMarqueeProps {
  children: React.ReactNode;
  speed?: number; // scroll speed in pixels per second
  direction?: 'left' | 'right'; // scroll direction
  pauseOnHover?: boolean; // pause on hover
  gradient?: boolean; // show gradient overlay
  gradientColor?: string; // gradient color
  gradientWidth?: number | string; // gradient width
  autoFill?: boolean; // automatically duplicate to fill container
  className?: string; // custom container class
  innerClassName?: string; // custom inner wrapper class
}

export const EnhancedMarquee: React.FC<EnhancedMarqueeProps> = ({
  children,
  speed = 40,
  direction = 'left',
  pauseOnHover = false,
  gradient = false,
  gradientColor = 'white',
  gradientWidth = 200,
  autoFill = false,
  className = '',
  innerClassName = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const singleRef = useRef<HTMLDivElement>(null);
  const [numRepeats, setNumRepeats] = useState(1);
  const [singleWidth, setSingleWidth] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Interaction refs
  const isDragging = useRef(false);
  const isTouching = useRef(false);
  const isScrollingWheel = useRef(false);
  const isHovering = useRef(false);
  
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null);
  const resumeSpeedProgress = useRef(1); // 0 to 1

  // Handle dynamic measuring and auto-filling
  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const single = singleRef.current;
      if (!container || !single) return;

      const containerWidth = container.getBoundingClientRect().width;
      // Get the width of one set of repeated children
      const totalSingleWidth = single.getBoundingClientRect().width;
      const baseWidth = totalSingleWidth / numRepeats;

      if (baseWidth > 0) {
        let needed = 1;
        if (autoFill) {
          needed = Math.ceil(containerWidth / baseWidth);
        }
        // Ensure at least 1 copy is rendered and total width of one repeat is wide enough
        const newNumRepeats = Math.max(1, needed);
        if (newNumRepeats !== numRepeats) {
          setNumRepeats(newNumRepeats);
        }
        setSingleWidth(baseWidth * newNumRepeats);
        setIsReady(true);
      }
    };

    // Delay a tiny bit to ensure the browser has laid out the DOM elements
    const timer = setTimeout(measure, 50);

    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measure);
    };
  }, [children, numRepeats, autoFill]);

  // Set initial scroll position to the middle copy when width is determined
  useEffect(() => {
    const container = containerRef.current;
    if (container && singleWidth > 0) {
      container.scrollLeft = singleWidth;
    }
  }, [singleWidth]);

  // Animation frame loop for continuous auto-scrolling
  useEffect(() => {
    let lastTime = 0;
    let animationFrameId: number;

    const loop = (time: number) => {
      if (!lastTime) {
        lastTime = time;
        animationFrameId = requestAnimationFrame(loop);
        return;
      }
      
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      const container = containerRef.current;
      if (container && singleWidth > 0) {
        const isInteracting =
          isDragging.current ||
          isTouching.current ||
          isScrollingWheel.current ||
          (pauseOnHover && isHovering.current);

        if (!isInteracting) {
          // Smoothly ramp speed progress back up to 1
          if (resumeSpeedProgress.current < 1) {
            resumeSpeedProgress.current = Math.min(1, resumeSpeedProgress.current + dt * 2.0); // 0.5s ramp up
          }

          // Direction multiplier: left scrolling increases scrollLeft, right scrolling decreases it
          const dirMultiplier = direction === 'left' ? 1 : -1;
          const step = speed * dirMultiplier * resumeSpeedProgress.current * dt;
          
          container.scrollLeft += step;
        } else {
          // Reset speed progress while interacting, so it resumes from 0
          resumeSpeedProgress.current = 0;
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [singleWidth, speed, direction, pauseOnHover]);

  // Trackpad / Wheel listener to detect manual scroll stops
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > 0) {
        isScrollingWheel.current = true;
        resumeSpeedProgress.current = 0;
        if (wheelTimeout.current) clearTimeout(wheelTimeout.current);

        wheelTimeout.current = setTimeout(() => {
          isScrollingWheel.current = false;
        }, 200);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      container.removeEventListener('wheel', handleWheel);
      if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
    };
  }, []);

  // Handle scroll updates to perform infinite wrap-around
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container || singleWidth <= 0) return;

    const scrollLeft = container.scrollLeft;

    if (scrollLeft >= singleWidth * 2) {
      const diff = scrollLeft - singleWidth * 2;
      container.scrollLeft = singleWidth + diff;
      if (isDragging.current) {
        scrollLeftStart.current -= singleWidth;
      }
    } else if (scrollLeft <= singleWidth) {
      const diff = singleWidth - scrollLeft;
      container.scrollLeft = singleWidth * 2 - diff;
      if (isDragging.current) {
        scrollLeftStart.current += singleWidth;
      }
    }
  };

  // Mouse drag handlers (Desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    isDragging.current = true;
    startX.current = e.clientX;
    scrollLeftStart.current = containerRef.current.scrollLeft;
    resumeSpeedProgress.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    e.preventDefault();
    const deltaX = e.clientX - startX.current;
    containerRef.current.scrollLeft = scrollLeftStart.current - deltaX;
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  const handleTouchStart = () => {
    isTouching.current = true;
    resumeSpeedProgress.current = 0;
  };

  const handleTouchEnd = () => {
    isTouching.current = false;
  };

  const repeatedChildren = Array.from({ length: numRepeats }, (_, i) => (
    <React.Fragment key={i}>{children}</React.Fragment>
  ));

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none scrollbar-hide ${className}`}
      style={{
        overflowX: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
        visibility: isReady ? 'visible' : 'hidden',
        cursor: isDragging.current ? 'grabbing' : 'grab',
      }}
      onScroll={handleScroll}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={() => {
        handleMouseUpOrLeave();
        isHovering.current = false;
      }}
      onMouseEnter={() => {
        isHovering.current = true;
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div className={`flex flex-row w-max ${innerClassName}`}>
        <div ref={singleRef} className="flex flex-row flex-shrink-0">
          {repeatedChildren}
        </div>
        <div className="flex flex-row flex-shrink-0" aria-hidden="true">
          {repeatedChildren}
        </div>
        <div className="flex flex-row flex-shrink-0" aria-hidden="true">
          {repeatedChildren}
        </div>
      </div>

      {/* Gradient overlays matching react-fast-marquee */}
      {gradient && (
        <>
          <div
            className="absolute top-0 bottom-0 left-0 z-[2] pointer-events-none"
            style={{
              width: typeof gradientWidth === 'number' ? `${gradientWidth}px` : gradientWidth,
              background: `linear-gradient(to right, ${gradientColor}, transparent)`,
            }}
          />
          <div
            className="absolute top-0 bottom-0 right-0 z-[2] pointer-events-none"
            style={{
              width: typeof gradientWidth === 'number' ? `${gradientWidth}px` : gradientWidth,
              background: `linear-gradient(to left, ${gradientColor}, transparent)`,
            }}
          />
        </>
      )}
    </div>
  );
};

export default EnhancedMarquee;
