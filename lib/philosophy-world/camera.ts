import type { WorldScene } from "@/config/animations/philosophy.config";
import { compositionBounds } from "./world";
export interface Viewport { width: number; height: number }
export interface CameraFrame { x: number; y: number; scale: number; rotation: number }
export function sceneFrame(scene: WorldScene, viewport: Viewport): CameraFrame {
  const box = scene.annotation.text;
  return { x: scene.node.x, y: scene.node.y + (box.y < 0 ? -95 : 105),
    scale: Math.min(1.1, (viewport.width - 60) / 440, (viewport.height - 110) / 460), rotation: 0 };
}
export function fitFrame(items: readonly WorldScene[], viewport: Viewport): CameraFrame {
  const bounds = compositionBounds(items);
  return { x: (bounds.minX + bounds.maxX) / 2, y: (bounds.minY + bounds.maxY) / 2,
    scale: Math.min((viewport.width - 56) / (bounds.maxX - bounds.minX), (viewport.height - 110) / (bounds.maxY - bounds.minY)), rotation: 0 };
}
export function cameraTransform(frame: CameraFrame, viewport: Viewport) {
  return `translate(${viewport.width / 2}px, ${viewport.height / 2}px) rotate(${frame.rotation}deg) scale(${frame.scale}) translate(${-frame.x}px, ${-frame.y}px)`;
}
