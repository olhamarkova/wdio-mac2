import { SearchScreen } from "../../app/screens/search-screen.ts";

const searchScreen = new SearchScreen();

describe("Search", () => {
  it("BKS-SRCH-001 @regression @search should show 'No Suggestions' message when searching for books that are not in collections", async function () {
    await searchScreen.navBar.openSearch();
    await searchScreen.searchForBooks("harry potter");
    await searchScreen.verifyNoSuggestionsShown();
  });
});
