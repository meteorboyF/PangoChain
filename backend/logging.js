const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../log.md');

// Clear the log file on startup
fs.writeFileSync(logFile, '');

const log = (level, ...args) => {
  const message = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg)).join(' ');
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${level.toUpperCase()}: ${message}\n`;

  // Write to the console
  process.stdout.write(logMessage);

  // Write to the log file
  fs.appendFileSync(logFile, logMessage);
};

console.log = (...args) => log('log', ...args);
console.error = (...args) => log('error', ...args);
console.warn = (...args) => log('warn', ...args);
