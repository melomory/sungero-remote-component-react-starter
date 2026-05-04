export interface IChangeNotifier {
  notify(): void;
  subscribe(listener: () => void): () => void;
}

export function createChangeNotifier(): IChangeNotifier {
  const listeners = new Set<() => void>();

  return {
    notify() {
      for (const listener of listeners) {
        listener();
      }
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
