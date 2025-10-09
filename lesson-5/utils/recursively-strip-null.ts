export function recursivelyStripNull(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(recursivelyStripNull);
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, recursivelyStripNull(v)]),
    );
  }
  if (value !== null) {
    return value;
  }
}
