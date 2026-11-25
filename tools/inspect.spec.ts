import { dumpPageSource } from "./page-source.ts";

/**
 * Not a test. Run with `npm run inspect` to dump the Books UI tree to
 * `.page-source/<INSPECT_NAME or "launch">.xml` for locator discovery.
 */
describe("inspect", () => {
  it("dumps the current page source", async () => {
    await dumpPageSource(process.env.INSPECT_NAME ?? "launch");
  });
});
