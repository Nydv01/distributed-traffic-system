import "@testing-library/jest-dom";
import { vi } from "vitest";

/* ------------------------------------------------------------------
   matchMedia (required for Tailwind, Framer Motion, shadcn/ui)
------------------------------------------------------------------- */
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),            // deprecated
    removeListener: vi.fn(),         // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

/* ------------------------------------------------------------------
   ResizeObserver (required for charts, animations, layouts)
------------------------------------------------------------------- */
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;

/* ------------------------------------------------------------------
   IntersectionObserver (lazy loading, animations, visibility)
------------------------------------------------------------------- */
class IntersectionObserverMock {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.IntersectionObserver =
  IntersectionObserverMock as unknown as typeof IntersectionObserver;

/* ------------------------------------------------------------------
   scrollTo (used by modals, navigation, smooth scrolling)
------------------------------------------------------------------- */
window.scrollTo = vi.fn();

/* ------------------------------------------------------------------
   requestAnimationFrame (Framer Motion stability)
------------------------------------------------------------------- */
window.requestAnimationFrame = (cb: FrameRequestCallback) => {
  return setTimeout(cb, 0);
};

window.cancelAnimationFrame = (id: number) => {
  clearTimeout(id);
};

/* ------------------------------------------------------------------
   Console noise control (optional but recommended)
------------------------------------------------------------------- */
vi.spyOn(console, "warn").mockImplementation(() => {});
vi.spyOn(console, "error").mockImplementation(() => {});
