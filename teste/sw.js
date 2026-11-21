self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('push', event => {
  const { taskId, description } = event.data?.json() ?? {};
  if (!/^[0-9a-f-]{36}$/i.test(taskId ?? '')) return;
  event.waitUntil(self.registration.showNotification('Captura', {
    body: typeof description === 'string' && description.trim() ? description : 'Você tem um lembrete.',
    tag: 'captura-' + taskId,
    data: { taskId }
  }));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = new URL('./', self.registration.scope);
  url.searchParams.set('tarefa', event.notification.data.taskId);
  event.waitUntil(clients.openWindow(url.href));
});
