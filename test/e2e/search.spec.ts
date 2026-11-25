import { IBooks } from "../../app/ibooks-app.ts";

const booksApp = new IBooks();

describe("Search", () => {
  it("BKS-SRCH-001 @regression @search should show 'No Suggestions' message when searching for books that are not in collections", async function () {
    await booksApp.searchForBooks("harry potter");
    await booksApp.verifyNoSuggestionsShown();
  });
});
