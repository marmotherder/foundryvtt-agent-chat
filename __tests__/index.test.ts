import '../src/index';

const handlers = (globalThis as any)._fvttHookHandlers;

test('simplePing export works', async () => {
  const mod = await import('../src/index');
  expect(mod.simplePing()).toContain('pong');
});

test('preCreateChatMessage intercepts /agent and calls ChatMessage.create', async () => {
  expect(handlers['preCreateChatMessage']).toBeDefined();
  const fn = handlers['preCreateChatMessage'][0];
  const chatData = { content: '/agent do something' };
  await fn(chatData, {}, 'user-id');
  expect((globalThis as any).ChatMessage.create).toHaveBeenCalled();
});
