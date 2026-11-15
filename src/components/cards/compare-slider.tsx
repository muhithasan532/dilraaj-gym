"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { SmartImage } from "@/components/common/ui";
import { cn } from "@/lib/utils";

/**
 * Accessible before/after comparison slider.
 * Works with pointer drag, keyboard (arrow keys on the range input) and touch.
 */
export function CompareSlider({
  beforeSrc,
  afterSrc,
  beforeLabel,
  afterLabel,
  className,
  initial = 50,
}: {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel: string;
  afterLabel: string;
  className?: string;
  initial?: number;
}) {
  const [position, setPosition] = useState(initial);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      setContainerWidth(entries[0]?.contentRect.width ?? 0);
    });
    observer.observe(node);
    setContainerWidth(node.offsetWidth);
    return () => observer.disconnect();
  }, []);

  const updateFromClientX = useCallback((clientX: number) => {
    const node = containerRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, next)));
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative select-none overflow-hidden bg-black", className)}
      onPointerDown={(event) => {
        dragging.current = true;
        (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
        updateFromClientX(event.clientX);
      }}
      onPointerMove={(event) => {
        if (dragging.current) updateFromClientX(event.clientX);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerLeave={() => {
        dragging.current = false;
      }}
    >
      <SmartImage bare src={afterSrc} alt={afterLabel} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <div
          className="h-full object-cover"
          style={{ width: containerWidth ? `${containerWidth}px` : "100%", filter: "grayscale(0.75) contrast(0.92) brightness(0.82)" }}
        >
          <SmartImage bare src={beforeSrc} alt={beforeLabel} className="h-full w-full object-cover" />
        </div>
      </div>

      <span className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-white/85 backdrop-blur">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-white/85 backdrop-blur">
        {afterLabel}
      </span>

      <div
        className="pointer-events-none absolute inset-y-0 w-px bg-white/80"
        style={{ left: `${position}%` }}
        aria-hidden="true"
      >
        <span className="absolute left-1/2 top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-black/60 backdrop-blur">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 6 4 12l5 6M15 6l5 6-5 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      <label className="sr-only" htmlFor={`compare-${beforeSrc}-${afterSrc}`}>
        Comparison position
      </label>
      <input
        id={`compare-${beforeSrc}-${afterSrc}`}
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        className="absolute inset-x-0 bottom-2 mx-auto w-[70%] cursor-ew-resize opacity-0 focus-visible:opacity-100"
        style={{ height: 4 }}
      />
    </div>
  );
}
