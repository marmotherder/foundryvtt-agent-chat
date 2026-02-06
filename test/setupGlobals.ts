// Minimal Foundry global mocks for tests
const handlers: Record<string, Function[]> = {};
(globalThis as any)._fvttHookHandlers = handlers;

(globalThis as any).Hooks = {
  on: (event: string, fn: Function) => { (handlers[event] ||= []).push(fn); return 0; },
  once: (event: string, fn: Function) => { (handlers[event] ||= []).push(fn); return 0; },
  off: () => {}
};

const createMock = jest.fn().mockResolvedValue({});
(globalThis as any).ChatMessage = {
  create: createMock,
};

(globalThis as any).game = {};

export {};
