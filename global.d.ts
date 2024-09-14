declare global {
  namespace NodeJS {
    interface Global {
      setTimeout: typeof setTimeout;
      clearTimeout: typeof clearTimeout;
      setInterval: typeof setInterval;
      clearInterval: typeof clearInterval;
      setImmediate: typeof setImmediate;
      clearImmediate: typeof clearImmediate;
    }
  }
}

export {};