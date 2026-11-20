import { isTauri } from "@tauri-apps/api/core";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";

/** Subscribe to a backend event; does nothing in a plain browser (dev preview). */
export async function onEvent<T>(name: string, cb: (payload: T) => void): Promise<UnlistenFn> {
  if (!isTauri()) return () => {};
  return listen<T>(name, (e) => cb(e.payload));
}
