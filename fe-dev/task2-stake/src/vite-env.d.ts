/// <reference types="vite/client" />
declare global {
  var Buffer: typeof import("buffer").Buffer;
}

// There must be an export for TS to recognize this file as a module;
// otherwise, it will be ignored
export {};
