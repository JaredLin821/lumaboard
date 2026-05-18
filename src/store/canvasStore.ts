import {create} from 'zustand';

interface CanvasState {
    zoom: number
    offsetX: number
    offsetY: number
    setZoom: (zoom: number) => void
    setOffset: (x: number, y: number) => void
    resetView: () => void
}

export const useCanvasStore = create<CanvasState>((set) => ({
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
    setZoom: (zoom) => set({zoom}),
    setOffset: (x, y) => set({offsetX: x, offsetY: y}),
    resetView: () => set({zoom : 1, offsetX: 0, offsetY: 0}),

}))