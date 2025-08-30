const log = (level, ...args) => {
  const message = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg)).join(' ');

  // Also send to the original console functions
  originalConsole[level](...args);

  // Send to the backend
  fetch('/api/log', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ level, message }),
  }).catch(error => {
    originalConsole.error('Failed to send log to backend:', error);
  });
};

const originalConsole = {
  log: console.log.bind(console),
  error: console.error.bind(console),
  warn: console.warn.bind(console),
};

console.log = (...args) => log('log', ...args);
console.error = (...args) => log('error', ...args);
console.warn = (...args) => log('warn', ...args);
