import { describe, it, expect } from 'vitest';

describe('Spatial Orbit Drag vs Click Intent Disambiguation', () => {
  const DRAG_THRESHOLD_PX = 6;

  const evaluatePointerIntent = (startX: number, endX: number, startY: number, endY: number) => {
    const deltaX = Math.abs(endX - startX);
    const deltaY = Math.abs(endY - startY);
    const totalDistance = Math.hypot(deltaX, deltaY);

    if (totalDistance > DRAG_THRESHOLD_PX) {
      return {
        isDrag: true,
        shouldSuppressClick: true,
        intent: 'scrub-orbit',
      };
    }

    return {
      isDrag: false,
      shouldSuppressClick: false,
      intent: 'open-story-details',
    };
  };

  it('recognizes micro-movements <= 6px as intentional clicks', () => {
    // 3px pointer jitter during click
    const result = evaluatePointerIntent(100, 103, 200, 200);
    expect(result.isDrag).toBe(false);
    expect(result.shouldSuppressClick).toBe(false);
    expect(result.intent).toBe('open-story-details');
  });

  it('recognizes exact pointer click (0px movement) as click', () => {
    const result = evaluatePointerIntent(150, 150, 300, 300);
    expect(result.isDrag).toBe(false);
    expect(result.shouldSuppressClick).toBe(false);
  });

  it('recognizes movement > 6px as intentional drag scrub and suppresses click', () => {
    // 25px horizontal drag to rotate orbit
    const result = evaluatePointerIntent(100, 125, 200, 202);
    expect(result.isDrag).toBe(true);
    expect(result.shouldSuppressClick).toBe(true);
    expect(result.intent).toBe('scrub-orbit');
  });

  it('recognizes diagonal swipe > 6px as drag', () => {
    // 5px X and 5px Y -> hypot is ~7.07px (> 6px)
    const result = evaluatePointerIntent(100, 105, 100, 105);
    expect(result.isDrag).toBe(true);
    expect(result.shouldSuppressClick).toBe(true);
  });
});
