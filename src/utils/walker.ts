import { opendir } from "node:fs/promises";
import { join } from "node:path";

export async function* walk(
  directory: string
): AsyncGenerator<string, void, unknown> {
  for await (let dir of await opendir(directory)) {
    const path = join(directory, dir.name);
    if (dir.isDirectory()) yield* walk(path);
    yield path;
  }
}
