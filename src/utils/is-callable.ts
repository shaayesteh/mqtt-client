export function isCallable(fn: unknown): fn is () => unknown {
  return typeof fn === "function";
}
