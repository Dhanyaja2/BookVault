// simple console wrapper; swap with pino in prod if you like
export default {
  info: console.log,
  error: console.error,
  warn: console.warn,
};
