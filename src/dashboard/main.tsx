import React from 'react'
import { createRoot } from 'react-dom/client'
import Dashboard from './Dashboard';
import log from 'electron-log/renderer';

const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug,
};

['log', 'error', 'warn', 'info', 'debug'].forEach((level: any) => {
  // @ts-ignore
  console[level] = (...args: any[]) => {
    // @ts-ignore
    originalConsole[level](...args);
    // @ts-ignore
    log[level](...args);
  };
});


createRoot(document.getElementById('root')).render(<Dashboard />)