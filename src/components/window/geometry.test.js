import { describe, expect, it } from "vitest";
import { clampPosition, computeResize } from "./geometry.js";

const viewport = { width: 1280, height: 800 };
const min = { minWidth: 400, minHeight: 300 };
const rect = { x: 200, y: 100, width: 600, height: 400 };

describe("clampPosition", () => {
  it("leaves a normal position alone", () => {
    expect(clampPosition({ x: 300, y: 200, width: 600 }, viewport)).toEqual({ x: 300, y: 200 });
  });

  it("never lets the title bar go above the screen", () => {
    expect(clampPosition({ x: 300, y: -50, width: 600 }, viewport).y).toBe(0);
  });

  it("never lets the title bar hide behind the taskbar", () => {
    expect(clampPosition({ x: 300, y: 5000, width: 600 }, viewport).y).toBe(800 - 40 - 40);
  });

  it("keeps a grabbable strip on screen on the left and right", () => {
    expect(clampPosition({ x: -5000, y: 0, width: 600 }, viewport).x).toBe(96 - 600);
    expect(clampPosition({ x: 5000, y: 0, width: 600 }, viewport).x).toBe(1280 - 96);
  });
});

describe("computeResize", () => {
  it("right/bottom grow the size and keep the origin", () => {
    expect(computeResize("bottom-right", rect, 50, 30, min)).toEqual({
      x: 200,
      y: 100,
      width: 650,
      height: 430,
    });
  });

  it("left keeps the right edge fixed", () => {
    const next = computeResize("left", rect, -100, 0, min);
    expect(next.width).toBe(700);
    expect(next.x + next.width).toBe(rect.x + rect.width);
  });

  it("top keeps the bottom edge fixed", () => {
    const next = computeResize("top", rect, 0, -60, min);
    expect(next.height).toBe(460);
    expect(next.y + next.height).toBe(rect.y + rect.height);
  });

  it("stops at the minimum size and the opposite edge does not move", () => {
    const next = computeResize("top-left", rect, 5000, 5000, min);
    expect(next.width).toBe(400);
    expect(next.height).toBe(300);
    expect(next.x + next.width).toBe(rect.x + rect.width);
    expect(next.y + next.height).toBe(rect.y + rect.height);
  });

  it("does not push the top edge above the screen", () => {
    const next = computeResize("top", rect, 0, -5000, min);
    expect(next.y).toBe(0);
    expect(next.y + next.height).toBe(rect.y + rect.height);
  });
});
