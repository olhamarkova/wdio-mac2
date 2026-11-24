export class IBooksLocators {
  prefix = "//XCUIElementType";
  searchButton = `${this.prefix}Cell[@label="Search"]`;
  searchField = `${this.prefix}SearchField[@label="Apple Books"]`;
  noSuggestionsMsg = `${this.prefix}StaticText[@label="No Suggestions"]`;
}
