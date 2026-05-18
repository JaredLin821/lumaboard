"use client";

import { useRef, useEffect } from "react";
import { useCanvasStore } from "@/store/canvasStore";

export default function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const { zoom, offsetX, offsetY, setOffset } = useCanvasStore();

  const gridSize = 20;

  const gridStyle = {
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
    `,
    backgroundSize: `${gridSize * zoom}px ${gridSize * zoom}px`,
    backgroundPosition: `${offsetX % (gridSize * zoom)}px ${offsetY % (gridSize * zoom)}px`,
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isPanning.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    setOffset(offsetX + dx, offsetY + dy);
  };

  const handleMouseUp = () => {
    isPanning.current = false;
  };

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const { zoom, offsetX, offsetY, setZoom, setOffset } = useCanvasStore.getState()
      const zoomFactor = e.deltaY > 0 ? 0.95 : 1.05
      const newZoom = Math.min(Math.max(zoom * zoomFactor, 1), 30)

      const rect = container.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      const newOffsetX = mouseX - (mouseX - offsetX) * (newZoom / zoom)
      const newOffsetY = mouseY - (mouseY - offsetY) * (newZoom / zoom)

      setZoom(newZoom)
      setOffset(newOffsetX, newOffsetY)
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-screen overflow-hidden bg-[#111] cursor-grab active:cursor-grabbing"
      style={gridStyle}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        style={{
          transform: `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`,
          transformOrigin: "0 0",
          position: "absolute",
        }}
      >
        {/* Canvas content goes here */}
      </div>
    </div>
  );
}
