import { IBooks } from "../../app/ibooks-app.ts";

const booksApp = new IBooks();

describe("IBooks App Testing", () => {
  it("should show 'No Suggestions' message", async function () {
    await booksApp.searchForBooks("harry potter");
    await booksApp.verifyNoSuggestionsShown();
  });
});
