/** Generic helpers for reading/writing nested paths inside the content document. */

export function clone<T>(value: T): T {
  if (typeof structuredClone === "function") {
    try {
      return structuredClone(value);
    } catch {
      /* fall through */
    }
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

export function getByPath(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc === null || acc === undefined) return undefined;
    if (Array.isArray(acc)) return acc[Number(key)];
    if (typeof acc === "object") return (acc as Record<string, unknown>)[key];
    return undefined;
  }, source);
}

export function setByPath<T>(source: T, path: string, value: unknown): T {
  const keys = path.split(".");
  const next = clone(source) as Record<string, unknown>;
  let cursor: Record<string, unknown> = next;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      cursor[key] = value;
      return;
    }
    const child = cursor[key];
    if (typeof child !== "object" || child === null) {
      cursor[key] = {};
    }
    cursor = cursor[key] as Record<string, unknown>;
  });

  return next as unknown as T;
}

/**
 * Write `value` at a dotted `path` by mutating the object in place.
 *
 * `setByPath` returns a *copy*, so it only works when the caller assigns the
 * result back. Drafts handed to `update()` are already deep clones, so
 * mutating them directly is the safe (and cheap) option — forgetting to assign
 * a returned copy is exactly what made the settings editors read-only.
 */
export function setInPlace(target: unknown, path: string, value: unknown): void {
  if (typeof target !== "object" || target === null) return;
  const keys = path.split(".");
  let cursor = target as Record<string, unknown>;

  for (let index = 0; index < keys.length - 1; index += 1) {
    const key = keys[index];
    const child = cursor[key];
    if (typeof child !== "object" || child === null) {
      cursor[key] = {};
    }
    cursor = cursor[key] as Record<string, unknown>;
  }

  cursor[keys[keys.length - 1]] = value;
}

export function newId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-3)}`;
}
