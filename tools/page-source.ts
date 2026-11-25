import { browser } from "@wdio/globals";
import { mkdir, writeFile } from "node:fs/promises";

const OUT_DIR = ".page-source";

/**
 * Saves the current accessibility tree (XML) of the app under test to
 * `.page-source/<name>.xml` and returns the file path.
 *
 * Use it to find real locators. To inspect a screen deeper than the launch
 * screen, call it temporarily inside a test after the navigation steps, then
 * remove the call before committing.
 */
export async function dumpPageSource(name: string): Promise<string> {
  await mkdir(OUT_DIR, { recursive: true });
  const file = `${OUT_DIR}/${name.replace(/[^\w.-]+/g, "_")}.xml`;
  await writeFile(file, await browser.getPageSource());
  console.log(`[inspect] page source saved to ${file}`);
  return file;
}
