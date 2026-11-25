export interface PointerRevealState {
  /** Viewport coordinates for SmoothCursor */
  clientX: number;
  clientY: number;
  /** Whether pointer is over the hero portrait container */
  overPortrait: boolean;
  /** Current reveal mask radius in CSS px */
  revealRadius: number;
  /** Whether pointer is over an interactive CTA / link / button */
  overInteractive: boolean;
  /** Whether custom cursor is initialised on a fine-pointer desktop device */
  cursorActive: boolean;
}

type Listener = (state: PointerRevealState) => void;

class CursorSyncStore {
  private state: PointerRevealState = {
    clientX: -200,
    clientY: -200,
    overPortrait: false,
    revealRadius: 132,
    overInteractive: false,
    cursorActive: false,
  };

  private listeners = new Set<Listener>();

  getSnapshot(): PointerRevealState {
    return this.state;
  }

  update(patch: Partial<PointerRevealState>): void {
    Object.assign(this.state, patch);
    this.listeners.forEach((listener) => listener(this.state));
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const cursorStore = new CursorSyncStore();
